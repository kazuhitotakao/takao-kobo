import { createPageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';
import { BackLink } from '@/components/back-link';
import { ExternalLink } from '@/components/external-link';
import { SubPage } from '@/components/sub-page';
import { getWork, getWorks, parseTechnologies, splitLines } from '@/lib/works';

const focusRingClassName = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

const pillClassName = `inline-flex items-center gap-2 rounded-full border px-7 py-3 font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRingClassName}`;

// 公開時に存在する作品はビルドで静的に生成する。あとから増えた作品は初回アクセス時に生成される。
// Cache Components では空配列だとビルドエラーになるので、作品が0件のときは存在しない id を渡して 404 にする
export async function generateStaticParams() {
  const works = await getWorks();
  return works.length > 0 ? works.map((work) => ({ id: work.id })) : [{ id: '__placeholder__' }];
}

export async function generateMetadata({ params }: PageProps<'/works/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const work = await getWork(id);
  if (!work) return { title: 'ページが見つかりません', robots: { index: false } };
  return createPageMetadata({
    title: work.title,
    description: work.summary,
    path: `/works/${work.id}`,
    image: work.thumbnail,
  });
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="border-l-4 border-sky-400 pl-3 text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-6 leading-loose text-slate-700 sm:text-lg">{children}</div>
    </section>
  );
}

async function WorkDetail({ params }: { params: PageProps<'/works/[id]'>['params'] }) {
  const { id } = await params;
  const work = await getWork(id);
  if (!work) {
    notFound();
  }

  const technologies = parseTechnologies(work.technologies);
  // 箇条書きの「・」は一覧の見た目（リストの点）と重なるので外す
  const features = splitLines(work.features).map((line) => line.replace(/^[・•\-*]\s*/, ''));
  const backgroundParagraphs = splitLines(work.background);

  return (
    <article className="mt-8">
      <ul aria-label="区分" className="flex flex-wrap gap-2">
        {work.category.map((category) => (
          <li
            key={category}
            className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-semibold tracking-wider text-sky-800"
          >
            {category}
          </li>
        ))}
      </ul>
      <h1 className="mt-3 text-3xl leading-snug font-bold sm:text-4xl">{work.title}</h1>
      {work.summary && <p className="mt-5 leading-loose text-slate-700 sm:text-lg">{work.summary}</p>}

      {work.thumbnail && (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl border border-sky-100 bg-sky-100 shadow-sm">
          <Image
            src={work.thumbnail.url}
            alt={work.thumbnail.alt ?? ''}
            fill
            sizes="(min-width: 864px) 800px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </div>
      )}

      {(work.demoUrl || work.githubUrl) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {work.demoUrl && (
            <ExternalLink
              href={work.demoUrl}
              className={`${pillClassName} border-sky-200 bg-sky-100 text-sky-900 hover:border-sky-300 hover:bg-sky-200`}
            >
              公開サイトを見る
            </ExternalLink>
          )}
          {work.githubUrl && (
            <ExternalLink
              href={work.githubUrl}
              className={`${pillClassName} border-slate-300 bg-white text-slate-800 hover:border-slate-400`}
            >
              GitHubでコードを見る
            </ExternalLink>
          )}
        </div>
      )}

      {/* 手描きイラストを後から各セクションに差し込めるよう、セクション同士の間は広めにあけておく */}
      <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
        {work.description && (
          <DetailSection title="作品について">
            {/* リッチエディタの HTML は microCMS の管理画面から自分で書いたものだけなので、そのまま描画する */}
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: work.description }} />
          </DetailSection>
        )}

        {backgroundParagraphs.length > 0 && (
          <DetailSection title="制作の背景">
            <div className="space-y-5">
              {backgroundParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </DetailSection>
        )}

        {features.length > 0 && (
          <DetailSection title="主な機能">
            <ul className="list-disc space-y-2 pl-6 marker:text-sky-400">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </DetailSection>
        )}

        {(technologies.names.length > 0 || technologies.notes.length > 0) && (
          <DetailSection title="使用技術">
            {technologies.names.length > 0 && (
              <ul aria-label="使用技術" className="flex flex-wrap gap-2">
                {technologies.names.map((name) => (
                  <li
                    key={name}
                    className="rounded-md border border-sky-100 bg-white px-3 py-1 text-sm font-medium text-sky-900"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
            {technologies.notes.length > 0 && (
              <div className="mt-5 space-y-1 text-sm leading-relaxed text-slate-500">
                {technologies.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            )}
          </DetailSection>
        )}
      </div>

      <div className="mt-16 border-t border-sky-200 pt-8 sm:mt-20">
        <BackLink href="/works">Works一覧へ戻る</BackLink>
      </div>
    </article>
  );
}

// 事前に生成していない作品を開いたときや、本文の先読みが間に合わなかったときに一瞬見える
function WorkDetailFallback() {
  return (
    <div role="status" className="mt-8 animate-pulse motion-reduce:animate-none">
      <span className="sr-only">作品を読み込んでいます</span>
      <div className="h-5 w-20 rounded-full bg-sky-100" />
      <div className="mt-4 h-9 w-2/3 rounded-md bg-sky-100" />
      <div className="mt-6 h-4 w-full rounded bg-sky-100" />
      <div className="mt-3 h-4 w-5/6 rounded bg-sky-100" />
      <div className="mt-10 aspect-video rounded-2xl bg-sky-100" />
    </div>
  );
}

// Header と一覧へ戻るリンクは作品によらないので、params を読む本文だけを Suspense に入れて先に枠を出せるようにする
export default function WorkDetailPage({ params }: PageProps<'/works/[id]'>) {
  return (
    <SubPage slug="works" isDetail>
      <BackLink href="/works">Works一覧へ戻る</BackLink>
      <Suspense fallback={<WorkDetailFallback />}>
        <WorkDetail params={params} />
      </Suspense>
    </SubPage>
  );
}
