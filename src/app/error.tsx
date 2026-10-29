'use client';

import { BackLink } from '@/components/back-link';
import { SubPage } from '@/components/sub-page';

// microCMS から取得できないときなど、表示中にエラーが起きたときに出す。
// 一時的な失敗のことが多いので、取得し直して表示し直すボタンを置く。
// 本番ではエラーの内容が伏せられて届く（サーバーのログで digest から追える）ので、画面には出さない
export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <SubPage>
      <h1 className="text-3xl font-bold">ページを表示できませんでした</h1>
      <p className="mt-6 leading-loose text-slate-700 sm:text-lg">
        一時的に読み込めなかった可能性があります。少し時間をおいて、もう一度お試しください。
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-8 py-3 font-semibold text-sky-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          もう一度読み込む
        </button>
        <BackLink href="/">トップへ戻る</BackLink>
      </div>
    </SubPage>
  );
}
