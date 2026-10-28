import Link from 'next/link';
import type { ReactNode } from 'react';
import { MenuIllustration } from '@/components/home/menu-illustration';
import { MenuTitle } from '@/components/page-transition';
import { menuCaptions, menuNames, type MenuSlug } from '@/lib/menu';

// トップのカードのリンク部分。About me（AboutCard）とほかのカードで共通にする
export const menuCardClassName =
  'group relative block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500';

// カードの見た目。About me では後ろに人物を置くので、それより手前に来るよう relative にして不透明な背景で隠す
export function MenuCardFace({ slug, illustration }: { slug: MenuSlug; illustration?: ReactNode }) {
  return (
    <span className="relative flex min-h-40 justify-between gap-4 rounded-2xl border-2 border-navy bg-white p-6 transition-colors duration-200 group-hover:bg-sky-50 group-focus-visible:bg-sky-50 group-data-[phase=leaving]:bg-sky-50 motion-reduce:transition-none">
      <span className="flex flex-col">
        <span className="text-2xl font-bold">
          <MenuTitle slug={slug}>{menuNames[slug]}</MenuTitle>
        </span>
        <span className="mt-1 text-sm font-medium text-slate-500">{menuCaptions[slug]}</span>
        <span
          aria-hidden
          className="mt-auto self-start pt-6 text-xl text-navy transition group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        >
          →
        </span>
      </span>
      {illustration && <span className="shrink-0 self-center">{illustration}</span>}
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
