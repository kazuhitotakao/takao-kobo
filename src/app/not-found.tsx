import type { Metadata } from 'next';
import { BackLink } from '@/components/back-link';
import { SubPage } from '@/components/sub-page';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
};

// 存在しない URL と、記事・作品の詳細で notFound() になったときの両方で出す
export default function NotFound() {
  return (
    <SubPage>
      <h1 className="text-3xl font-bold">ページが見つかりません</h1>
      <p className="mt-2 text-sm font-semibold tracking-[0.2em] text-sky-700">404 Not Found</p>
      <p className="mt-6 leading-loose text-slate-700 sm:text-lg">
        お探しのページは、移動または削除されたか、URLが間違っている可能性があります。
      </p>
      <div className="mt-10">
        <BackLink href="/">トップへ戻る</BackLink>
      </div>
    </SubPage>
  );
}
