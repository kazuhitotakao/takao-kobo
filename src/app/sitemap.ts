import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { getBlogArticleHeadlines } from '@/lib/blog';
import { siteUrl } from '@/lib/metadata';
import { getWorks } from '@/lib/works';

// sitemap.ts はリクエスト時の API を使わないとビルド時の内容のまま固定され、次のデプロイまで新しい記事・作品が載らない。
// connection() でアクセスのたびに組み立て直し、microCMS から取得した記事・作品だけを数分キャッシュする
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  // 一覧の10件制限に関係なく、全公開記事を載せる。本文は取得しない。
  const [articles, works] = await Promise.all([getBlogArticleHeadlines(), getWorks()]);

  return [
    ...['/', '/about', '/works', '/blog', '/contact'].map((path) => ({
      url: new URL(path, siteUrl).href,
    })),
    ...articles.map((article) => ({
      url: new URL(`/blog/${article.id}`, siteUrl).href,
      lastModified: article.updatedAt,
    })),
    ...works.map((work) => ({
      url: new URL(`/works/${work.id}`, siteUrl).href,
      lastModified: work.updatedAt,
    })),
  ];
}
