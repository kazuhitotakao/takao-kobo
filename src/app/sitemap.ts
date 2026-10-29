import type { MetadataRoute } from 'next';
import { cacheLife } from 'next/cache';
import { siteUrl } from '@/lib/metadata';
import { microcmsClient } from '@/lib/microcms';
import type { BlogArticle } from '@/types/blog';
import { getWorks } from '@/lib/works';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache';
  cacheLife('minutes');

  // 一覧の10件制限に関係なく、全公開記事を載せる。本文は取得しない。
  const [articles, works] = await Promise.all([
    microcmsClient.getAllContents<Pick<BlogArticle, 'id' | 'updatedAt'>>({
      endpoint: 'blogs',
      queries: { fields: ['id', 'updatedAt'] },
    }),
    getWorks(),
  ]);

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
