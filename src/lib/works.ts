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

// 一覧と同じキャッシュを使い回し、詳細ページごとに API を呼ばない
export async function getWork(id: string): Promise<Work | undefined> {
  const works = await getWorks();
  return works.find((work) => work.id === id);
}

// テキストエリアの値を、空行を除いた1行ずつの配列にする
export function splitLines(text?: string): string[] {
  return (text ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

// technologies の1行目は技術名、2行目以降は補足（過去の構築環境など）として扱う。
// 「@vite-pwa/nuxt」のような名前を分けないよう、前後どちらかに空白がある / だけで区切る
export function parseTechnologies(technologies?: string): { names: string[]; notes: string[] } {
  const [firstLine = '', ...notes] = splitLines(technologies);
  return {
    names: firstLine
      .split(/\s+\/\s*|\s*\/\s+/)
      .map((name) => name.trim())
      .filter(Boolean),
    notes,
  };
}
