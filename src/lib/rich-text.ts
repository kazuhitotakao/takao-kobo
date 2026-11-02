import 'server-only';
import { cacheLife } from 'next/cache';

// リッチテキストの本文が広がる最大の幅（Container の中身の最大幅）
const contentMaxWidth = 800;

const imgTagPattern = /<img\b[^>]*>/gi;

// microCMS に保存した画像の、向きを反映した幅と高さ。
// スマホの写真は横長のまま保存し、向きの情報（EXIF の Orientation）で縦に見せていることがあるので、
// 画像 API のメタデータ（fm=json）から向きも読んで縦横を決める。同じ URL の画像は変わらないので長くキャッシュする。
// 取得に失敗したときは例外にして、失敗した結果をキャッシュしないようにする
async function getMicrocmsImageSize(url: string): Promise<{ width: number; height: number }> {
  'use cache';
  cacheLife('max');

  const response = await fetch(`${url}?fm=json`);
  if (!response.ok) {
    throw new Error(`画像の情報を取得できませんでした（${response.status}）: ${url}`);
  }
  const { PixelWidth, PixelHeight, Orientation } = await response.json();
  // Orientation が 5〜8 の画像は 90 度回して見せるので、縦横を入れ替える
  return Orientation >= 5 ? { width: PixelHeight, height: PixelWidth } : { width: PixelWidth, height: PixelHeight };
}

function getAttribute(tag: string, name: string) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

async function optimizeImageTag(tag: string) {
  const src = getAttribute(tag, 'src')?.replace(/&amp;/g, '&');
  const url = src && URL.canParse(src) ? new URL(src) : undefined;
  if (url?.hostname !== 'images.microcms-assets.io') {
    return tag;
  }

  const imageUrl = url.origin + url.pathname;
  const size = await getMicrocmsImageSize(imageUrl).catch(() => undefined);
  if (!size) {
    return tag;
  }

  // エディタで縮小した幅（URL の w か width 属性）で見せる。縮小していない画像は本文の幅まで。元の画像より大きくはしない
  const requestedWidth = Number(url.searchParams.get('w')) || Number(getAttribute(tag, 'width')) || contentMaxWidth;
  const width = Math.min(requestedWidth, contentMaxWidth, size.width);
  const height = Math.round((width * size.height) / size.width);
  const src1x = `${imageUrl}?w=${width}`;
  const attributes = [
    `src="${escapeAttribute(src1x)}"`,
    `srcset="${escapeAttribute(`${src1x} 1x, ${src1x}&dpr=2 2x`)}"`,
    `width="${width}"`,
    `height="${height}"`,
  ].join(' ');
  return tag.replace(/\s(?:src|srcset|width|height)="[^"]*"/gi, '').replace(/^<img/i, `<img ${attributes}`);
}

// microCMS のリッチエディタで挿入した画像が、ぼやけずに表示されるよう書き換える。
// エディタで縮小すると、URL に ?w=200&h=150 のような大きさが付き、その大きさちょうどの画像しか届かない。
// そのため高精細な画面ではぼやけ、縦向きの写真は縦横を取り違えてさらに小さくなる。
// そこで表示する幅だけを指定し直し、高精細な画面向けに 2 倍の大きさの画像を srcset で用意する。
// 幅と高さの属性も実際の縦横比に合わせて直し、読み込みの前後で本文がずれないようにする
export async function optimizeRichTextImages(html: string) {
  const tags = html.match(imgTagPattern) ?? [];
  const optimizedTags = await Promise.all(tags.map(optimizeImageTag));
  let index = 0;
  return html.replace(imgTagPattern, () => optimizedTags[index++]);
}
