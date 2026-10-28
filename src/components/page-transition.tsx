import { ViewTransition, type ReactNode } from 'react';
import type { MenuSlug } from '@/lib/menu';

const directionalTransition = {
  'nav-forward': 'nav-forward',
  'nav-back': 'nav-back',
  default: 'none',
};

// layout は遷移しても残り続けて enter/exit が発火しないので、各 page で包む
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={directionalTransition} exit={directionalTransition} default="none">
      {children}
    </ViewTransition>
  );
}

// トップのカード見出しと各ページの見出しで同じ name を使い、見出しが移動して見えるようにする
export function MenuTitle({ slug, children }: { slug: MenuSlug; children: ReactNode }) {
  return (
    <ViewTransition name={`menu-title-${slug}`} share="morph" default="none">
      <span className="inline-block">{children}</span>
    </ViewTransition>
  );
}
