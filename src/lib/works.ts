import 'server-only';
import { cacheLife } from 'next/cache';
import { microcmsClient } from '@/lib/microcms';
import type { Work } from '@/types/work';

export async function getWorks(): Promise<Work[]> {
  'use cache';
  cacheLife('minutes');

  // 作品が増えても取りこぼさないよう、件数上限のある getList ではなく全件取得する
  const works = await microcmsClient.getAllContents<Work>({
    endpoint: 'works',
  });

  // displayOrder の小さい順に並べる。未登録の作品は後ろに回し、その中では microCMS から返った順を保つ
  const sortKey = (work: Work) => work.displayOrder ?? Number.MAX_SAFE_INTEGER;
  return works.sort((a, b) => sortKey(a) - sortKey(b));
}
