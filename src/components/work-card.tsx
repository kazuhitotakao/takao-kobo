import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from '@/components/external-link';
import { parseTechnologies } from '@/lib/works';
import type { Work } from '@/types/work';

// 学習課題のカードに並べる技術名の上限。残りは詳細ページで見せる
const compactTechnologyLimit = 5;

const focusRingClassName = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

type WorkCardProps = {
  work: Work;
  // featured は個人開発の大きいカード、compact は学習課題の小さいカード
  variant: 'featured' | 'compact';
  // 未指定なら「詳しく見る」を出さない
  detailHref?: string;
  // ページを開いてすぐ見える位置のカードだけ、サムネイルを遅延読み込みせず先に読む
  aboveTheFold?: boolean;
};

export function WorkCard({ work, variant, detailHref, aboveTheFold = false }: WorkCardProps) {
  const isFeatured = variant === 'featured';
  // 補足の行（過去の構築環境など）は詳細ページだけで出す
  const technologyNames = parseTechnologies(work.technologies).names;
  const visibleTechnologyNames = isFeatured
    ? technologyNames
    : technologyNames.slice(0, compactTechnologyLimit);
  const hiddenTechnologyCount = technologyNames.length - visibleTechnologyNames.length;
  const technologiesLabelId = `work-${work.id}-technologies`;

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden border border-sky-100 bg-white shadow-sm transition duration-200 hover:border-sky-300 hover:shadow-md motion-reduce:transition-none ${
        isFeatured ? 'rounded-2xl' : 'rounded-xl'
      }`}
    >
      {work.thumbnail && (
        // サムネイルは下側が白っぽいものが多く、白い本文と境目が分かりにくいので、淡い水色の帯で額縁のように囲む
        <div className={`border-b border-sky-200 bg-sky-100 ${isFeatured ? 'p-4 sm:p-5' : 'p-3'}`}>
          <div
            className={`relative aspect-video overflow-hidden shadow-sm ring-1 ring-sky-900/10 ${
              isFeatured ? 'rounded-xl' : 'rounded-lg'
            }`}
          >
            <Image
              src={work.thumbnail.url}
              alt={work.thumbnail.alt ?? ''}
              fill
              sizes={
                isFeatured
                  ? '(min-width: 864px) 760px, 100vw'
                  : '(min-width: 864px) 364px, (min-width: 640px) 50vw, 100vw'
              }
              loading={aboveTheFold ? 'eager' : undefined}
              fetchPriority={aboveTheFold ? 'high' : undefined}
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className={`flex flex-1 flex-col ${isFeatured ? 'p-6 sm:p-10' : 'p-5 sm:p-6'}`}>
        {!isFeatured && (
          <ul aria-label="区分" className="flex flex-wrap gap-2">
            {work.category.map((category) => (
              <li
                key={category}
                className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-sky-800"
              >
                {category}
              </li>
            ))}
          </ul>
        )}

        <h3 className={isFeatured ? 'text-2xl font-bold sm:text-3xl' : 'mt-3 text-lg leading-snug font-bold'}>
          {work.title}
        </h3>

        {work.summary && (
          <p
            className={
              isFeatured
                ? 'mt-4 leading-loose text-slate-700 sm:text-lg'
                : 'mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600'
            }
          >
            {work.summary}
          </p>
        )}

        {technologyNames.length > 0 && (
          <div className={isFeatured ? 'mt-6' : 'mt-4'}>
            <p id={technologiesLabelId} className="text-xs font-semibold tracking-wider text-slate-500">
              使用技術
            </p>
            <ul aria-labelledby={technologiesLabelId} className="mt-2 flex flex-wrap gap-1.5">
              {visibleTechnologyNames.map((name) => (
                <li
                  key={name}
                  className={`rounded-md border border-sky-100 bg-sky-50 font-medium text-sky-900 ${
                    isFeatured ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs'
                  }`}
                >
                  {name}
                </li>
              ))}
              {hiddenTechnologyCount > 0 && (
                <li className="px-1 py-0.5 text-xs text-slate-500">ほか{hiddenTechnologyCount}件</li>
              )}
            </ul>
          </div>
        )}

        {(detailHref || work.demoUrl) && (
          <div
            className={`flex flex-wrap items-center ${isFeatured ? 'mt-8 gap-3' : 'mt-auto gap-x-5 gap-y-2 pt-5 text-sm'}`}
          >
            {detailHref && (
              // 既定の prefetch は詳細ページの枠だけなので、本文まで先読みして遷移直後に読み込み表示を出さない。
              // ::after をカード全体に広げて、どこを押しても詳細へ進めるようにする（<a> は入れ子にできないため）。
              // translate や scale を付けると ::after の基準がこのリンクに変わって押せる範囲が縮むので、色の変化だけにする
              <Link
                href={detailHref}
                prefetch={true}
                transitionTypes={['nav-forward']}
                className={
                  isFeatured
                    ? `group inline-flex items-center gap-2 rounded-full bg-slate-800 px-7 py-3 font-semibold text-white shadow-sm transition-colors duration-200 after:absolute after:inset-0 hover:bg-slate-700 motion-reduce:transition-none ${focusRingClassName}`
                    : `group inline-flex items-center gap-1 rounded-sm font-semibold text-sky-800 transition-colors after:absolute after:inset-0 hover:text-sky-600 ${focusRingClassName}`
                }
              >
                詳しく見る
                <span className="sr-only">：{work.title}</span>
                <span
                  aria-hidden
                  className="transition group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                >
                  →
                </span>
              </Link>
            )}
            {work.demoUrl && (
              // カード全体に広げた「詳しく見る」の上に重ねて、こちらは公開サイトへ進めるようにする
              <ExternalLink
                href={work.demoUrl}
                className={
                  isFeatured
                    ? `relative z-10 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-7 py-3 font-semibold text-sky-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-200 hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRingClassName}`
                    : `relative z-10 inline-flex items-center gap-1 rounded-sm font-semibold text-sky-800 transition-colors hover:text-sky-600 ${focusRingClassName}`
                }
              >
                公開サイトを見る
              </ExternalLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
