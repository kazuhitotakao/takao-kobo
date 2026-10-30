import { createPageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';
import { BackLink } from '@/components/back-link';
import { DraftPreviewBanner } from '@/components/draft-preview-banner';
import { ExternalLink } from '@/components/external-link';
import { SubPage } from '@/components/sub-page';
import { getDraftContent, getDraftKey } from '@/lib/draft';
import { getWork, getWorks, parseTechnologies, splitLines } from '@/lib/works';
import type { Work } from '@/types/work';

const focusRingClassName = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

const pillClassName = `inline-flex items-center gap-2 rounded-full border px-7 py-3 font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRingClassName}`;

// 公開時に存在する作品はビルドで静的に生成する。あとから増えた作品は初回アクセス時に生成される。
// Cache Components では空配列だとビルドエラーになるので、作品が0件のときは存在しない id を渡して 404 にする
export async function generateStaticParams() {
  const works = await getWorks();
  return works.length > 0 ? works.map((work) => ({ id: work.id })) : [{ id: '__placeholder__' }];
}

// プレビュー中は draftKey で下書きを取り、それ以外はキャッシュした公開作品を使う
async function getWorkForPage(id: string, draftKey?: string) {
  return draftKey ? getDraftContent<Work>('works', id, draftKey) : getWork(id);
}

export async function generateMetadata({ params, searchParams }: PageProps<'/works/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const work = await getWorkForPage(id, await getDraftKey(searchParams));
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

async function WorkDetail({ params, searchParams }: PageProps<'/works/[id]'>) {
  const { id } = await params;
  const draftKey = await getDraftKey(searchParams);
  const work = await getWorkForPage(id, draftKey);
  if (!work) {
    notFound();
  }

  const technologies = parseTechnologies(work.technologies);
  // 箇条書きの「・」は一覧の見た目（リストの点）と重なるので外す
  const features = splitLines(work.features).map((line) => line.replace(/^[・•\-*]\s*/, ''));
  const backgroundParagraphs = splitLines(work.background);
  const roleParagraphs = splitLines(work.role);

  return (
    <article className="mt-8">
      {draftKey && <DraftPreviewBanner backHref="/works" />}
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

      {(roleParagraphs.length > 0 || technologies.names.length > 0) && (
        <dl className={`mt-6 grid gap-5 rounded-2xl border border-sky-200 bg-white/80 p-5 sm:p-6 ${roleParagraphs.length > 0 && technologies.names.length > 0 ? 'sm:grid-cols-2' : ''}`}>
          {roleParagraphs.length > 0 && (
            <div>
              <dt className="text-sm font-bold text-sky-900">担当範囲</dt>
              <dd className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
                {roleParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </dd>
            </div>
          )}
          {technologies.names.length > 0 && (
            <div>
              <dt className="text-sm font-bold text-sky-900">主な使用技術</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2">
                  {technologies.names.slice(0, 3).map((name) => (
                    <li key={name} className="rounded-md bg-sky-50 px-2.5 py-1 text-sm font-medium text-sky-900">{name}</li>
                  ))}
                </ul>
                <a href="#work-technologies" className={`mt-1 inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-600 ${focusRingClassName}`}>
                  技術の役割を見る
                </a>
              </dd>
            </div>
          )}
        </dl>
      )}

      {work.thumbnail && (
        <div className="relative mx-auto mt-10 aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-sky-100 bg-sky-100 shadow-sm">
          <Image
            src={work.thumbnail.url}
            alt={work.thumbnail.alt ?? ''}
            fill
            sizes="(min-width: 488px) 448px, calc(100vw - 40px)"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </div>
      )}

      {(work.demoUrl || work.githubUrl) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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

      {/* 制作の目的と自分で考えた工夫を先に見せ、機能・技術・補足を続ける */}
      <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
        {backgroundParagraphs.length > 0 && (
          <DetailSection title="制作の目的">
            <div className="space-y-5">
              {backgroundParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </DetailSection>
        )}

        {work.highlights && (
          <DetailSection title="工夫した点">
            {/* microCMSの管理画面で入力したHTMLだけを表示する。技術用語には用途や理由を添える */}
            <div className="rich-text rounded-2xl border border-sky-200 bg-white/80 p-5 sm:p-8" dangerouslySetInnerHTML={{ __html: work.highlights }} />
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
          <div id="work-technologies" className="scroll-mt-44 sm:scroll-mt-28">
            <DetailSection title="使用技術と役割">
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
                <dl className="mt-6 divide-y divide-sky-100 rounded-xl border border-sky-100 bg-white/70 px-4 sm:px-6">
                  {technologies.notes.map((note) => {
                    const separator = note.indexOf('：');
                    return (
                      <div key={note} className="grid gap-1 py-4 text-sm leading-relaxed sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5">
                        <dt className={separator > 0 ? 'font-semibold text-slate-800' : 'sr-only'}>{separator > 0 ? note.slice(0, separator) : '補足'}</dt>
                        <dd className={`min-w-0 break-words text-slate-600 ${separator > 0 ? '' : 'sm:col-span-2'}`}>{separator > 0 ? note.slice(separator + 1) : note}</dd>
                      </div>
                    );
                  })}
                </dl>
              )}
            </DetailSection>
          </div>
        )}

        {work.description && (
          <DetailSection title="作品の補足">
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: work.description }} />
          </DetailSection>
        )}
      </div>

      <div className="mt-16 border-t border-sky-200 pt-8 sm:mt-20">
        <BackLink href="/works" restoreScroll>Works一覧へ戻る</BackLink>
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
      <div className="mx-auto mt-10 aspect-video w-full max-w-md rounded-2xl bg-sky-100" />
    </div>
  );
}

// Header と一覧へ戻るリンクは作品によらないので、params を読む本文だけを Suspense に入れて先に枠を出せるようにする
export default function WorkDetailPage({ params, searchParams }: PageProps<'/works/[id]'>) {
  return (
    <SubPage slug="works" isDetail>
      <BackLink href="/works" restoreScroll>Works一覧へ戻る</BackLink>
      <Suspense fallback={<WorkDetailFallback />}>
        <WorkDetail params={params} searchParams={searchParams} />
      </Suspense>
    </SubPage>
  );
}
