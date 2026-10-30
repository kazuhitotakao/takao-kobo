import { createPageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BackLink } from '@/components/back-link';
import { BlogCategories } from '@/components/blog-categories';
import { BlogBackLink } from '@/components/blog-back-link';
import { DraftPreviewBanner } from '@/components/draft-preview-banner';
import { ShowEndWhenTall } from '@/components/show-end-when-tall';
import { SubPage } from '@/components/sub-page';
import { formatDate, getBlogArticle, getBlogArticleIds } from '@/lib/blog';
import { getDraftContent, getDraftKey } from '@/lib/draft';
import type { BlogArticle } from '@/types/blog';

// 公開時に存在する記事はビルドで静的に生成する。あとから増えた記事は初回アクセス時に生成される。
// Cache Components では空配列だとビルドエラーになるので、記事が0件のときは存在しない id を渡して 404 にする
export async function generateStaticParams() {
  const ids = await getBlogArticleIds();
  return ids.length > 0 ? ids.map((id) => ({ id })) : [{ id: '__placeholder__' }];
}

// プレビュー中は draftKey で下書きを取り、それ以外はキャッシュした公開記事を使う
async function getArticle(id: string, draftKey?: string) {
  return draftKey ? getDraftContent<BlogArticle>('blogs', id, draftKey) : getBlogArticle(id);
}

export async function generateMetadata({ params, searchParams }: PageProps<'/blog/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id, await getDraftKey(searchParams));
  if (!article) return { title: 'ページが見つかりません', robots: { index: false } };
  return createPageMetadata({
    title: article.title,
    description: article.summary,
    path: `/blog/${article.id}`,
    image: article.thumbnail,
    publishedTime: article.publishedAt ?? article.createdAt,
    modifiedTime: article.updatedAt,
  });
}

async function BlogArticleDetail({ params, searchParams }: PageProps<'/blog/[id]'>) {
  const { id } = await params;
  const draftKey = await getDraftKey(searchParams);
  const article = await getArticle(id, draftKey);
  if (!article) {
    notFound();
  }

  const publishedAt = article.publishedAt ?? article.createdAt;

  return (
    <article className="mt-8">
      {draftKey && <DraftPreviewBanner backHref="/blog" />}
      {/* 短い記事だと上下の「一覧へ戻る」が並んでしまうので、記事が画面より長いときだけ下にも出す */}
      <ShowEndWhenTall
        end={
          <div className="mt-16 border-t border-sky-200 pt-8 sm:mt-20">
            <Suspense fallback={<BackLink href="/blog" restoreScroll>Blog一覧へ戻る</BackLink>}><BlogBackLink /></Suspense>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
          <time dateTime={publishedAt} className="shrink-0 text-sm font-medium text-slate-500">
            {formatDate(publishedAt)}
          </time>
          <BlogCategories categories={article.category} />
        </div>
        <h1 className="mt-4 text-3xl leading-snug font-bold sm:text-4xl">{article.title}</h1>

        {article.thumbnail && (
          <div className="relative mx-auto mt-8 aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-sky-100 bg-sky-100 shadow-sm">
            <Image
              src={article.thumbnail.url}
              alt={article.thumbnail.alt ?? ''}
              fill
              sizes="(min-width: 488px) 448px, calc(100vw - 40px)"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        )}

        {/* リッチエディタの HTML は microCMS の管理画面から自分で書いたものだけなので、そのまま描画する */}
        <div
          className="rich-text mt-10 leading-loose text-slate-700 sm:mt-12 sm:text-lg"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </ShowEndWhenTall>
    </article>
  );
}

// 事前に生成していない記事を開いたときや、本文の先読みが間に合わなかったときに一瞬見える
function BlogArticleFallback() {
  return (
    <div role="status" className="mt-8 animate-pulse motion-reduce:animate-none">
      <span className="sr-only">記事を読み込んでいます</span>
      <div className="h-4 w-28 rounded bg-sky-100" />
      <div className="mt-4 h-9 w-2/3 rounded-md bg-sky-100" />
      <div className="mt-12 h-4 w-full rounded bg-sky-100" />
      <div className="mt-3 h-4 w-full rounded bg-sky-100" />
      <div className="mt-3 h-4 w-4/5 rounded bg-sky-100" />
    </div>
  );
}

// Header と一覧へ戻るリンクは記事によらないので、params を読む本文だけを Suspense に入れて先に枠を出せるようにする
export default function BlogArticlePage({ params, searchParams }: PageProps<'/blog/[id]'>) {
  return (
    <SubPage slug="blog" isDetail>
      <Suspense fallback={<BackLink href="/blog" restoreScroll>Blog一覧へ戻る</BackLink>}><BlogBackLink /></Suspense>
      <Suspense fallback={<BlogArticleFallback />}>
        <BlogArticleDetail params={params} searchParams={searchParams} />
      </Suspense>
    </SubPage>
  );
}
