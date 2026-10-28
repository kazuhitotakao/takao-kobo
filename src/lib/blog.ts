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

// 記事詳細をビルドで静的に生成するため、一覧の件数上限によらず全記事の ID を取る
export async function getBlogArticleIds(): Promise<string[]> {
  'use cache';
  cacheLife('minutes');

  return microcmsClient.getAllContentIds({ endpoint: 'blogs' });
}

export async function getBlogArticle(id: string): Promise<BlogArticle | undefined> {
  'use cache';
  cacheLife('minutes');

  // microCMS のコンテンツ ID は英数字・-・_ だけなので、それ以外の URL は API を呼ばずに見つからない扱いにする
  if (!/^[\w-]+$/.test(id)) {
    return undefined;
  }

  // getListDetail は存在しない ID でエラーを投げるので、一覧を ID で絞り込み、0件なら見つからない扱いにする
  const response = await microcmsClient.getList<BlogArticle>({
    endpoint: 'blogs',
    queries: {
      ids: id,
    },
  });

  return response.contents[0];
}

const dateFormat = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', dateStyle: 'long' });

// microCMS の日時は UTC なので、日本時間の「2026年10月27日」の形にする
export function formatDate(isoString: string): string {
  return dateFormat.format(new Date(isoString));
}
