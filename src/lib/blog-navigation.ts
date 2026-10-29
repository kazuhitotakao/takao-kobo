// 一覧の条件をURLに保持し、ページ切り替えや詳細から戻るときにも使う。
export function blogListHref(page = 1, category = '') {
  const query = new URLSearchParams();
  if (category) query.set('category', category);
  if (page > 1) query.set('page', String(page));
  const search = query.toString();
  return search ? `/blog?${search}` : '/blog';
}

export function parseBlogPage(value: string | string[] | undefined) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}
