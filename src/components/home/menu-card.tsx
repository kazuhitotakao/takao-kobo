import Link from 'next/link';
import type { ReactNode } from 'react';
import { MenuIllustration } from '@/components/home/menu-illustration';
import { MenuTitle } from '@/components/page-transition';
import { menuCaptions, menuNames, type MenuSlug } from '@/lib/menu';

export const menuCardClassName = 'kobo-home__cardLink';

const cardNumbers: Record<MenuSlug, string> = { about: '01', blog: '02', works: '03', contact: '04' };
const cardNotes: Record<MenuSlug, string> = {
  about: 'どんな人がつくっているの？',
  blog: '日々の記録をのぞく',
  works: 'つくってきたものを見る',
  contact: '気軽にお話ししましょう',
};

// 見た目だけをトップ用に変更し、既存のリンク・見出しのページ遷移はそのまま使う。
export function MenuCardFace({ slug, illustration }: { slug: MenuSlug; illustration?: ReactNode }) {
  return (
    <span className="kobo-home__cardFace">
      <span className="kobo-home__cardNumber" aria-hidden>{cardNumbers[slug]} / {slug === 'about' ? 'INTRODUCTION' : slug.toUpperCase()}</span>
      {illustration && <span className={slug === 'contact' ? 'kobo-home__illustration kobo-home__contactIllustration' : 'kobo-home__illustration'}>{illustration}</span>}
      <span className="kobo-home__cardTitle"><MenuTitle slug={slug}>{menuNames[slug]}</MenuTitle><span className="kobo-home__titleDot">.</span></span>
      <span className="kobo-home__cardDescription">{menuCaptions[slug]}</span>
      <span className="kobo-home__cardBottom"><span>{cardNotes[slug]}</span><span className="kobo-home__cardArrow" aria-hidden>↗</span></span>
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
