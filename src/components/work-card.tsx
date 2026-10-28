import Image from 'next/image';
import Link from 'next/link';
import type { Work } from '@/types/work';

// 学習課題のカードに並べる技術名の上限。残りは詳細ページで見せる
const compactTechnologyLimit = 5;

const focusRingClassName = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

// technologies の1行目を技術名として扱い、2行目以降の補足（過去の構築環境など）は一覧では出さない。
// 「@vite-pwa/nuxt」のような名前を分けないよう、前後どちらかに空白がある / だけで区切る
function getTechnologyNames(technologies?: string): string[] {
  const [firstLine = ''] = technologies?.split(/\r?\n/) ?? [];
  return firstLine
    .split(/\s+\/\s*|\s*\/\s+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

type WorkCardProps = {
  work: Work;
  // featured は個人開発の大きいカード、compact は学習課題の小さいカード
  variant: 'featured' | 'compact';
  // 作品詳細ページ（/works/[id]）ができたら渡す。未指定のあいだは「詳しく見る」を出さない
  detailHref?: string;
  // ページを開いてすぐ見える位置のカードだけ、サムネイルを遅延読み込みせず先に読む
  aboveTheFold?: boolean;
};

export function WorkCard({ work, variant, detailHref, aboveTheFold = false }: WorkCardProps) {
  const isFeatured = variant === 'featured';
  const technologyNames = getTechnologyNames(work.technologies);
  const visibleTechnologyNames = isFeatured
    ? technologyNames
    : technologyNames.slice(0, compactTechnologyLimit);
  const hiddenTechnologyCount = technologyNames.length - visibleTechnologyNames.length;
  const technologiesLabelId = `work-${work.id}-technologies`;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden border border-sky-100 bg-white shadow-sm transition duration-200 hover:border-sky-300 hover:shadow-md motion-reduce:transition-none ${
        isFeatured ? 'rounded-2xl' : 'rounded-xl'
      }`}
    >
      {work.thumbnail && (
        <div className="relative aspect-video border-b border-sky-100 bg-sky-100">
          <Image
            src={work.thumbnail.url}
            alt={work.thumbnail.alt ?? ''}
            fill
            sizes={
              isFeatured ? '(min-width: 768px) 720px, 100vw' : '(min-width: 768px) 348px, (min-width: 640px) 50vw, 100vw'
            }
            loading={aboveTheFold ? 'eager' : undefined}
            fetchPriority={aboveTheFold ? 'high' : undefined}
            className="object-cover"
          />
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
              <Link
                href={detailHref}
                transitionTypes={['nav-forward']}
                className={
                  isFeatured
                    ? `inline-flex items-center gap-2 rounded-full bg-slate-800 px-7 py-3 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRingClassName}`
                    : `group inline-flex items-center gap-1 rounded-sm font-semibold text-sky-800 transition-colors hover:text-sky-600 ${focusRingClassName}`
                }
              >
                詳しく見る
                <span
                  aria-hidden
                  className={
                    isFeatured
                      ? undefined
                      : 'transition group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0'
                  }
                >
                  →
                </span>
              </Link>
            )}
            {work.demoUrl && (
              <a
                href={work.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isFeatured
                    ? `inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-7 py-3 font-semibold text-sky-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-200 hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRingClassName}`
                    : `inline-flex items-center gap-1 rounded-sm font-semibold text-sky-800 transition-colors hover:text-sky-600 ${focusRingClassName}`
                }
              >
                公開サイトを見る
                <span className="sr-only">（新しいタブで開きます）</span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 4h6v6" />
                  <path d="M20 4 10 14" />
                  <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
