'use client';

import { useSearchParams } from 'next/navigation';
import { BackLink } from '@/components/back-link';
import { blogListHref, parseBlogPage } from '@/lib/blog-navigation';

export function BlogBackLink() {
  const query = useSearchParams();
  return <BackLink restoreScroll href={blogListHref(parseBlogPage(query.get('page') ?? undefined), query.get('category') ?? '')}>Blog一覧へ戻る</BackLink>;
}
