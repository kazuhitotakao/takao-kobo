import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

// 下書きのプレビュー中だと分かるように本文の上に出す。終了すると Draft Mode を切って一覧へ戻る
export function DraftPreviewBanner({ backHref }: { backHref: '/blog' | '/works' }) {
  async function exitPreview() {
    'use server';
    (await draftMode()).disable();
    redirect(backHref);
  }

  return (
    <aside
      role="status"
      className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <p className="font-semibold">下書きをプレビューしています</p>
      <form action={exitPreview}>
        <button
          type="submit"
          className="min-h-11 rounded-full border border-amber-300 bg-white px-4 font-semibold transition-colors hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          プレビューを終了
        </button>
      </form>
    </aside>
  );
}
