import 'server-only';
import type { MicroCMSListContent } from 'microcms-js-sdk';
import { draftMode } from 'next/headers';
import { microcmsClient } from '@/lib/microcms';

export type DraftEndpoint = 'blogs' | 'works';

// microCMS の画面プレビュー（/api/draft で Draft Mode を有効にしたとき）だけ、URL の draftKey を使う。
// 通常の表示で searchParams を読むと詳細ページが静的生成されなくなるので、先に Draft Mode かどうかを確かめる
export async function getDraftKey(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
): Promise<string | undefined> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) {
    return undefined;
  }

  const { draftKey } = await searchParams;
  return typeof draftKey === 'string' && draftKey !== '' ? draftKey : undefined;
}

// 下書きは draftKey を付けた詳細取得でしか返らない。プレビューでは毎回最新を見たいのでキャッシュしない
export async function getDraftContent<T>(
  endpoint: DraftEndpoint,
  id: string,
  draftKey: string,
): Promise<(T & MicroCMSListContent) | undefined> {
  // microCMS のコンテンツ ID は英数字・-・_ だけなので、それ以外は API を呼ばずに見つからない扱いにする
  if (!/^[\w-]+$/.test(id)) {
    return undefined;
  }

  // 存在しない ID や合わない draftKey ではエラーになるので、見つからない扱いにする
  return microcmsClient
    .getListDetail<T>({ endpoint, contentId: id, queries: { draftKey } })
    .catch(() => undefined);
}
