// 実行: node scripts/generate-og-image.mjs
// 日本語フォントを必要な文字だけ取得し、公開用PNGを生成する。公開時の外部フォント通信は不要。
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { ImageResponse } = require('next/og');
const { createElement: h } = require('react');
const title = '髙尾工房';
const tagline = '一歩ずつ、つくっていく。';
const cssUrl = new URL('https://fonts.googleapis.com/css2');
cssUrl.searchParams.set('family', 'Noto Sans JP:wght@700');
cssUrl.searchParams.set('text', title + tagline + 'TAKAO KOBO / Step by Step');
const cssResponse = await fetch(cssUrl);
if (!cssResponse.ok) throw new Error(`フォントCSS取得失敗: ${cssResponse.status}`);
const css = await cssResponse.text();
const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
if (!fontUrl) throw new Error('フォントURLが見つかりません');
const fontResponse = await fetch(fontUrl);
if (!fontResponse.ok) throw new Error(`フォント取得失敗: ${fontResponse.status}`);
const font = await fontResponse.arrayBuffer();
const navy = '#223a70';
const image = new ImageResponse(
  h('div', { style: { display: 'flex', width: '100%', height: '100%', background: 'linear-gradient(135deg, #ffffff 10%, #e0f2fe 100%)', padding: 48, fontFamily: 'Noto Sans JP', color: navy } },
    // Notionのブックマーク等は中央だけ切り取って表示するため、要素は中央寄せで中央約560px幅に収める
    h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', border: '3px solid #b9def2', borderRadius: 28, padding: '48px 60px', justifyContent: 'space-between', alignItems: 'center' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 24 } },
        h('svg', { width: 84, height: 80, viewBox: '0 0 48 45', fill: 'none' },
          h('g', { stroke: navy, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' },
            h('path', { d: 'M4 21L23 5L43 21M9 18V40H38V18M20 40V29H29V40' }),
            h('path', { d: 'M18 17H29V24H18ZM31 11.4V6H37V16.2' }),
          ),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
          h('div', { style: { fontSize: 68, letterSpacing: 8, lineHeight: 1.2 } }, title),
          h('div', { style: { fontSize: 19, letterSpacing: 7, marginTop: 10 } }, 'TAKAO KOBO'),
        ),
      ),
      h('div', { style: { fontSize: 44, lineHeight: 1.5 } }, tagline),
      h('div', { style: { fontSize: 20, color: '#487ea3', letterSpacing: 3 } }, 'Step by Step'),
    ),
  ),
  { width: 1200, height: 630, fonts: [{ name: 'Noto Sans JP', data: font, weight: 700, style: 'normal' }] },
);
await writeFile(new URL('../public/og-image.png', import.meta.url), Buffer.from(await image.arrayBuffer()));
console.log('public/og-image.png を生成しました（1200×630）');
