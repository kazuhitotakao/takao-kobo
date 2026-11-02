import 'server-only';
import { cacheLife } from 'next/cache';
import { microcmsClient } from '@/lib/microcms';
import type { BlogArticle } from '@/types/blog';

export const BLOG_PAGE_SIZE = 10;

// 一覧と前後の記事で同じ並び（新しい順）にする
const blogOrders = '-publishedAt,-createdAt,id';

export async function getBlogCategories(): Promise<string[]> {
  'use cache';
  cacheLife('minutes');

  // 本文を取得せず、公開記事で使われているカテゴリだけを集める。
  const articles = await microcmsClient.getAllContents<Pick<BlogArticle, 'category'>>({
    endpoint: 'blogs',
    queries: { fields: ['id', 'category'] },
  });
  return [...new Set(articles.flatMap((article) => article.category ?? []))];
}

export async function getBlogArticles(page = 1, category = '') {
  'use cache';
  cacheLife('minutes');

  return microcmsClient.getList<Omit<BlogArticle, 'body'>>({
    endpoint: 'blogs',
    queries: {
      limit: BLOG_PAGE_SIZE,
      offset: (page - 1) * BLOG_PAGE_SIZE,
      orders: blogOrders,
      fields: ['id', 'title', 'summary', 'category', 'publishedAt', 'createdAt'],
      ...(category ? { filters: `category[contains]${category}` } : {}),
    },
  });
}

// 記事詳細をビルドで静的に生成するため、一覧の件数上限によらず全記事の ID を取る
export async function getBlogArticleIds(): Promise<string[]> {
  'use cache';
  cacheLife('minutes');

  return microcmsClient.getAllContentIds({ endpoint: 'blogs' });
}

// 一覧の件数上限によらず、全公開記事の ID・タイトル・カテゴリ・更新日時を新しい順に取る。本文は取得しない。
// サイトマップと記事詳細の前後の記事で同じキャッシュを使い回し、記事ごとに API を呼ばない
export async function getBlogArticleHeadlines() {
  'use cache';
  cacheLife('minutes');

  return microcmsClient.getAllContents<Pick<BlogArticle, 'title' | 'category'>>({
    endpoint: 'blogs',
    queries: { fields: ['id', 'title', 'category', 'updatedAt'], orders: blogOrders },
  });
}

type BlogArticleHeadline = Pick<BlogArticle, 'id' | 'title' | 'category'>;

// 新しい順に並んだ articles の中で、id の記事のひとつ古い記事（前の記事）とひとつ新しい記事（次の記事）
function findAdjacent(articles: BlogArticleHeadline[], id: string): { previous?: BlogArticleHeadline; next?: BlogArticleHeadline } {
  const index = articles.findIndex((article) => article.id === id);
  if (index === -1) {
    return {};
  }
  return { previous: articles.at(index + 1), next: index > 0 ? articles[index - 1] : undefined };
}

// 記事詳細の下に出す前後の記事。全記事の中での前後に加え、カテゴリで絞った一覧から開いたとき用に、
// 記事のカテゴリごとの同じカテゴリの中での前後も返す（どちらを出すかは BlogAdjacentLinks で決める）。
// 公開前の下書きをプレビューしているときは一覧にないので、どれも出さない
export async function getAdjacentBlogArticles(id: string) {
  const articles = await getBlogArticleHeadlines();
  const categories = articles.find((article) => article.id === id)?.category ?? [];
  return {
    all: findAdjacent(articles, id),
    byCategory: Object.fromEntries(
      categories.map((category) => [
        category,
        findAdjacent(articles.filter((article) => article.category?.includes(category)), id),
      ]),
    ),
  };
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
