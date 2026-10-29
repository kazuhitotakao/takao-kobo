import type { MenuSlug } from '@/lib/menu';

// トップのカードに使うイラストの差し替え先。
// public/illustrations/ に背景が透明な PNG / WebP / SVG を置き、そのパス（例：'/illustrations/about.png'）を入れる。
// null の間は src/components/home/ の仮の線画を使う。
// about は About me カードの後ろから覗く人物。縦長（幅332：高さ512が目安）で、覗いたときに見せたい顔を右寄りに描く。
// 画像に差し替えても覗く・飛び出す動きはそのまま使えるが、手を振る姿への切り替えは付かない
export const illustrationSources: Record<MenuSlug, string | null> = {
  about: null,
  works: null,
  blog: null,
  contact: null,
};
