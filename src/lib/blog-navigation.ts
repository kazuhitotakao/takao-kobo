// 一覧の条件をURLに保持し、ページ切り替えや詳細から戻るときにも使う。
function blogListSearch(page: number, category: string) {
  const query = new URLSearchParams();
  if (category) query.set('category', category);
  if (page > 1) query.set('page', String(page));
  const search = query.toString();
  return search ? `?${search}` : '';
}

export function blogListHref(page = 1, category = '') {
  return `/blog${blogListSearch(page, category)}`;
}

// 一覧から開いた記事や、そこから移った前後の記事にも一覧の条件を付け、「Blog一覧へ戻る」で元の一覧に戻れるようにする
export function blogArticleHref(id: string, page = 1, category = '') {
  return `/blog/${id}${blogListSearch(page, category)}`;
}

export function parseBlogPage(value: string | string[] | undefined) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}
