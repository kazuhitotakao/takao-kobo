import Link from 'next/link';
import { SubPage } from '@/components/sub-page';
import { formatDate, getBlogArticles } from '@/lib/blog';

export default async function BlogPage() {
  const blogArticles = await getBlogArticles();

  return (
    <SubPage slug="blog">
      {blogArticles.length > 0 ? (
        <ul className="mt-10 space-y-4 sm:mt-12">
          {blogArticles.map((article) => {
            const publishedAt = article.publishedAt ?? article.createdAt;
            return (
              <li key={article.id}>
                {/* 既定の prefetch は詳細ページの枠だけなので、本文まで先読みして遷移直後に読み込み表示を出さない */}
                <Link
                  href={`/blog/${article.id}`}
                  prefetch={true}
                  transitionTypes={['nav-forward']}
                  className="group block rounded-xl border border-sky-100 bg-white p-5 shadow-sm transition duration-200 hover:border-sky-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 motion-reduce:transition-none sm:p-6"
                >
                  <time dateTime={publishedAt} className="text-sm font-medium text-slate-500">
                    {formatDate(publishedAt)}
                  </time>
                  <h2 className="mt-1 text-lg leading-snug font-bold transition-colors group-hover:text-sky-800 sm:text-xl">
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
        <p className="mt-10 text-slate-600">記事は準備中です。</p>
      )}
    </SubPage>
  );
}
