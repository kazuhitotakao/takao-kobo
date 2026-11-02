import type { Metadata } from 'next';

export const siteUrl = new URL('https://takao-kobo.vercel.app/');
export const siteName = '髙尾工房';
// 旧字の「髙」を打たずに「高尾工房」やローマ字で探されても、同じサイトだと伝わるようにする別名
export const siteAlternateNames = ['高尾工房', 'TAKAO KOBO'];
export const siteDescription = '一歩ずつ、つくっていく。つくること、暮らすことを記録する小さな工房。';

// titleはページ固有の名前。サイト名は共通レイアウトのtemplateで付ける。
export function createPageMetadata({
  title,
  description = siteDescription,
  path,
  image,
  publishedTime,
  modifiedTime,
}: {
  title?: string;
  description?: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const sharedImage = image ?? { url: '/og-image.png?v=2', width: 1200, height: 630, alt: '髙尾工房 — 一歩ずつ、つくっていく。' };

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName,
      locale: 'ja_JP',
      images: [sharedImage],
      ...(publishedTime ? { type: 'article', publishedTime, modifiedTime } : { type: 'website' }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [sharedImage],
    },
  };
}
