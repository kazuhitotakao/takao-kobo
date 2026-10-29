// 実行: node scripts/generate-icons.mjs
// 工房ロゴからfavicon（16/32/48px）とApple用アイコン（180px）を生成する。
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { ImageResponse } = require('next/og');
const { createElement: h } = require('react');

async function createIcon(size) {
  const logoSize = Math.round(size * 0.8);
  const response = new ImageResponse(
    h('div', { style: { display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#e0f2fe' } },
      h('svg', { width: logoSize, height: logoSize, viewBox: '0 0 48 45', fill: 'none' },
        h('g', { stroke: '#223a70', strokeWidth: size <= 32 ? 3 : 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' },
          h('path', { d: 'M4 21L23 5L43 21M9 18V40H38V18M20 40V29H29V40' }),
          h('path', { d: 'M18 17H29V24H18ZM31 11.4V6H37V16.2' }),
        ),
      ),
    ),
    { width: size, height: size },
  );
  return Buffer.from(await response.arrayBuffer());
}

// ICOのディレクトリに、サイズ別のPNG画像を格納する。
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(createIcon));
const directory = Buffer.alloc(6 + 16 * sizes.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(images[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
}
await writeFile(new URL('../src/app/favicon.ico', import.meta.url), Buffer.concat([directory, ...images]));
await writeFile(new URL('../src/app/apple-icon.png', import.meta.url), await createIcon(180));
console.log('favicon.ico（16/32/48px）とapple-icon.png（180px）を生成しました');
