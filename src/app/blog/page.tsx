import { createPageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { BlogCategories } from '@/components/blog-categories';
import { SubPage } from '@/components/sub-page';
import { BLOG_PAGE_SIZE, formatDate, getBlogArticles, getBlogCategories } from '@/lib/blog';
import { blogListHref, parseBlogPage } from '@/lib/blog-navigation';

async function resolveBlogQuery(searchParams: PageProps<'/blog'>['searchParams']) {
  const [query, categories] = await Promise.all([searchParams, getBlogCategories()]);
  const value = typeof query.category === 'string' ? query.category : '';
  // filtersでエスケープできない記号は受け付けず、公開記事で使用中のカテゴリだけを使う。
  const category = categories.includes(value) && !value.includes('[') && !value.includes(']') ? value : '';
  return { categories, category, page: parseBlogPage(query.page) };
}

export async function generateMetadata({ searchParams }: PageProps<'/blog'>) {
  const { category, page } = await resolveBlogQuery(searchParams);
  const title = ['Blog', category, page > 1 ? `${page}ページ目` : ''].filter(Boolean).join(' - ');
  return createPageMetadata({
    title,
    description: 'Web開発で学んだことや、釣り・家庭菜園など、日々の出来事を記録する髙尾工房のブログです。',
    path: blogListHref(page, category),
  });
}

async function BlogList({ searchParams }: { searchParams: PageProps<'/blog'>['searchParams'] }) {
  const { categories, category, page } = await resolveBlogQuery(searchParams);
  const { contents: blogArticles, totalCount } = await getBlogArticles(page, category);
  const pageCount = Math.max(1, Math.ceil(totalCount / BLOG_PAGE_SIZE));
  if (page > pageCount) redirect(blogListHref(pageCount, category));
  const listHref = blogListHref(page, category);
  const detailSearch = listHref.includes('?') ? listHref.slice(listHref.indexOf('?')) : '';
  const pageNumbers = [...new Set([1, page - 1, page, page + 1, pageCount])]
    .filter((number) => number >= 1 && number <= pageCount).sort((a, b) => a - b);

  return (
    <div key={listHref}>
      <nav aria-label="ブログのカテゴリ" className="mt-8 flex flex-wrap gap-2">
        {['', ...categories].map((value) => (
          <Link key={value} href={blogListHref(1, value)} aria-current={category === value ? 'page' : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${category === value ? 'border-sky-700 bg-sky-700 text-white' : 'border-sky-200 bg-white text-sky-800 hover:bg-sky-50'}`}>
            {value || 'すべて'}
          </Link>
        ))}
      </nav>
      <p className="mt-6 text-sm text-slate-600">
        {totalCount > 0 ? `全${totalCount}件中 ${(page - 1) * BLOG_PAGE_SIZE + 1}〜${Math.min(page * BLOG_PAGE_SIZE, totalCount)}件` : '0件'}
      </p>
      {blogArticles.length > 0 ? (
        <ul className="mt-10 space-y-4 sm:mt-12">
          {blogArticles.map((article) => {
            const publishedAt = article.publishedAt ?? article.createdAt;
            return (
              <li key={article.id}>
                {/* 既定の prefetch は詳細ページの枠だけなので、本文まで先読みして遷移直後に読み込み表示を出さない */}
                <Link
                  href={`/blog/${article.id}${detailSearch}`}
                  prefetch={true}
                  transitionTypes={['nav-forward']}
                  className="group block rounded-xl border border-sky-100 bg-white p-5 shadow-sm transition duration-200 hover:border-sky-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 motion-reduce:transition-none sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
                    <time dateTime={publishedAt} className="shrink-0 text-sm font-medium text-slate-500">
                      {formatDate(publishedAt)}
                    </time>
                    <BlogCategories categories={article.category} />
                  </div>
                  <h2 className="mt-3 text-lg leading-snug font-bold transition-colors group-hover:text-sky-800 sm:text-xl">
                    {article.title}
                  </h2>
                  {article.summary && <p className="mt-2 leading-relaxed text-slate-600">{article.summary}</p>}
                  <span aria-hidden className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                    続きを読む
                    <span className="transition group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-10 text-slate-600">{category ? 'このカテゴリの記事はまだありません。' : '記事は準備中です。'}</p>
      )}
      {totalCount > 0 && (
        <nav aria-label="ブログのページ切り替え" className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {page > 1 ? (
            <Link className={pageLinkClass} href={blogListHref(page - 1, category)} rel="prev">前へ</Link>
          ) : (
            <span aria-disabled="true" className={disabledPageClass}>前へ</span>
          )}
          {pageNumbers.map((number, index) => (
            <span key={number} className="inline-flex items-center gap-2">
              {index > 0 && number - pageNumbers[index - 1] > 1 && <span aria-hidden="true">…</span>}
              {number === page ? (
                <span className="rounded-lg border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-semibold text-white"
                  aria-label={`${number}ページ目`} aria-current="page">{number}</span>
              ) : (
                <Link className={pageLinkClass} href={blogListHref(number, category)} aria-label={`${number}ページ目`}>{number}</Link>
              )}
            </span>
          ))}
          {page < pageCount ? (
            <Link className={pageLinkClass} href={blogListHref(page + 1, category)} rel="next">次へ</Link>
          ) : (
            <span aria-disabled="true" className={disabledPageClass}>次へ</span>
          )}
        </nav>
      )}
    </div>
  );
}

const disabledPageClass = 'rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400';

const pageLinkClass = 'rounded-lg border border-sky-200 px-4 py-2 text-sm font-semibold hover:border-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

export default function BlogPage({ searchParams }: PageProps<'/blog'>) {
  return (
    <SubPage slug="blog">
      <Suspense fallback={<p role="status" className="mt-10 text-slate-600">記事を読み込んでいます…</p>}>
        <BlogList searchParams={searchParams} />
      </Suspense>
    </SubPage>
  );
}
