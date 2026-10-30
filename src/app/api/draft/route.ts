import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { getDraftContent, type DraftEndpoint } from '@/lib/draft';

const detailPaths: Record<DraftEndpoint, string> = {
  blogs: '/blog',
  works: '/works',
};

// microCMS の「画面プレビュー」から開く入口。遷移先URLは API ごとに次の形で設定する。
// /api/draft?secret=<MICROCMS_PREVIEW_SECRET>&endpoint=blogs&id={CONTENT_ID}&draftKey={DRAFT_KEY}
// draftKey は間違っていても公開済みの記事なら取得できてしまうので、secret で microCMS から開かれたことを確かめる
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = process.env.MICROCMS_PREVIEW_SECRET;
  if (!secret || searchParams.get('secret') !== secret) {
    return new Response('Invalid token', { status: 401 });
  }

  const endpoint = searchParams.get('endpoint');
  const id = searchParams.get('id');
  const draftKey = searchParams.get('draftKey');
  if ((endpoint !== 'blogs' && endpoint !== 'works') || !id || !draftKey) {
    return new Response('Invalid parameters', { status: 400 });
  }

  const content = await getDraftContent(endpoint, id, draftKey);
  if (!content) {
    return new Response('Content not found', { status: 404 });
  }

  (await draftMode()).enable();
  // 移動先は受け取った値をそのまま使わず、取得できたコンテンツの ID から組み立てる
  redirect(`${detailPaths[endpoint]}/${content.id}?draftKey=${encodeURIComponent(draftKey)}`);
}
