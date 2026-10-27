import 'server-only';
import { microcmsClient } from '@/lib/microcms';
import type { BlogArticle } from '@/types/blog';

export async function getBlogArticles(): Promise<BlogArticle[]> {
  const response = await microcmsClient.getList<BlogArticle>({
    endpoint: 'blogs',
    queries: {
      limit: 10,
    },
  });

  return response.contents;
}
