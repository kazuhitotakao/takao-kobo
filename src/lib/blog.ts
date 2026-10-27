import 'server-only';
import { cacheLife } from 'next/cache';
import { microcmsClient } from '@/lib/microcms';
import type { BlogArticle } from '@/types/blog';

export async function getBlogArticles(): Promise<BlogArticle[]> {
  'use cache';
  cacheLife('minutes');

  const response = await microcmsClient.getList<BlogArticle>({
    endpoint: 'blogs',
    queries: {
      limit: 10,
    },
  });

  return response.contents;
}
