'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { blogArticleHref, parseBlogPage } from '@/lib/blog-navigation';

type AdjacentArticle = { id: string; title: string };

type AdjacentArticleLinksProps = { previous?: AdjacentArticle; next?: AdjacentArticle };

// 記事詳細の下に並べる前後の記事へのリンク。読み終えたあとに続けてほかの記事も読めるようにする。
// ふだんは全記事の新しい順で前後を決め、カテゴリで絞った一覧から開いたときだけ、同じカテゴリの中で前後させる。
// あわせて一覧の条件（カテゴリ・ページ番号）を移動先にも引き継ぎ、「Blog一覧へ戻る」で元の一覧に戻れるようにする。
// 条件は URL のクエリにあり、読むと記事を静的生成できなくなるので、ブラウザ側で切り替える（それまでは全記事での前後を出す）
export function BlogAdjacentLinks({
  all,
  byCategory,
}: {
  all: AdjacentArticleLinksProps;
  byCategory: Record<string, AdjacentArticleLinksProps>;
}) {
  const query = useSearchParams();
  const category = query.get('category') ?? '';
  // 記事のカテゴリではない条件（URL を書き換えたときなど）では、全記事での前後にする
  const adjacent = category && Object.hasOwn(byCategory, category) ? byCategory[category] : all;
  return <AdjacentArticleLinks {...adjacent} page={parseBlogPage(query.get('page') ?? undefined)} category={category} />;
}

// PC では前の記事（古い記事）を左、次の記事（新しい記事）を右に置き、片方しかないときも左右の位置は変えない
export function AdjacentArticleLinks({
  previous,
  next,
  page = 1,
  category = '',
}: AdjacentArticleLinksProps & { page?: number; category?: string }) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav aria-label="前後の記事" className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2">
      {previous && <AdjacentArticleLink href={blogArticleHref(previous.id, page, category)} title={previous.title} direction="previous" />}
      {next && <AdjacentArticleLink href={blogArticleHref(next.id, page, category)} title={next.title} direction="next" />}
    </nav>
  );
}

function AdjacentArticleLink({ href, title, direction }: { href: string; title: string; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next';
  const arrowClassName = `transition motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 ${
    isNext ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'
  }`;

  // 一覧のリンクと同じく、本文まで先読みして遷移直後に読み込み表示を出さない
  return (
    <Link
      href={href}
      prefetch={true}
      transitionTypes={['nav-forward']}
      className={`group block rounded-xl border border-sky-100 bg-white p-5 shadow-sm transition duration-200 hover:border-sky-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 motion-reduce:transition-none ${
        isNext ? 'sm:col-start-2' : ''
      }`}
    >
      {/* PC で右の列に置く次の記事は、「次の記事 →」だけ右に寄せて進む向きを示す。タイトルは読みやすいよう左寄せのまま */}
      <span className={`flex items-center gap-1.5 text-sm font-semibold text-sky-700 ${isNext ? 'sm:justify-end' : ''}`}>
        {!isNext && <span aria-hidden className={arrowClassName}>←</span>}
        {isNext ? '次の記事' : '前の記事'}
        {isNext && <span aria-hidden className={arrowClassName}>→</span>}
      </span>
      <span className="mt-2 block leading-snug font-bold transition-colors group-hover:text-sky-800">{title}</span>
    </Link>
  );
}
