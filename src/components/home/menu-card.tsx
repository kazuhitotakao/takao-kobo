import Link from 'next/link';
import type { ReactNode } from 'react';
import { MenuIllustration } from '@/components/home/menu-illustration';
import { MenuTitle } from '@/components/page-transition';
import { menuCaptions, menuNames, type MenuSlug } from '@/lib/menu';

export const menuCardClassName = 'kobo-home__cardLink';

// 見た目だけをトップ用に変更し、既存のリンク・見出しのページ遷移はそのまま使う。
export function MenuCardFace({ slug, illustration }: { slug: MenuSlug; illustration?: ReactNode }) {
  return (
    <span className="kobo-home__cardFace">
      <span className="kobo-home__cardTitle"><MenuTitle slug={slug}>{menuNames[slug]}</MenuTitle></span>
      <span className="kobo-home__cardCaption">{menuCaptions[slug]}</span>
      {illustration && <span className="kobo-home__illustration">{illustration}</span>}
      <span className="kobo-home__cardArrow" aria-hidden>→</span>
    </span>
  );
}

export function MenuCard({ slug }: { slug: Exclude<MenuSlug, 'about'> }) {
  return (
    <Link href={`/${slug}`} transitionTypes={['nav-forward']} className={menuCardClassName}>
      <MenuCardFace slug={slug} illustration={<MenuIllustration slug={slug} />} />
    </Link>
  );
}
