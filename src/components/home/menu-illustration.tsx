import Image from 'next/image';
import { CharacterIcon } from '@/components/home/character';
import { illustrationSources } from '@/lib/illustrations';
import type { MenuSlug } from '@/lib/menu';

export function MenuIllustration({ slug }: { slug: MenuSlug }) {
  // about の差し替え画像は後ろからのぞく人物（Character）に使うので、カードの絵はいつも線画の人物にする。
  if (slug === 'about') {
    return <CharacterIcon />;
  }

  const src = illustrationSources[slug];
  if (src) {
    return <Image src={src} alt="" width={80} height={80} className="size-20 object-contain" />;
  }

  // 設定済みの画像を優先し、未設定の間だけ工房の仮イラストを使う。
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {slug === 'blog' && <><path d="M22 17L74 19V80L21 78ZM33 32H61M33 42H63M33 55H45V67H33ZM53 55H64M53 64H63" /><path d="M75 30L83 31V80H75" /></>}
        {/* つくってきたもの：ノートパソコンとコードの記号（積み木はカードの後ろから覗く） */}
        {slug === 'works' && <><path d="M20 24L80 23L81 62L19 63ZM19 63L8 75L92 74L81 62M44 69H56" /><path d="M41 35L34 43L41 51M59 35L66 43L59 51M54 33L46 53" /></>}
        {/* お問い合わせ：封筒（花はカードの後ろから覗く） */}
        {slug === 'contact' && <path d="M14 28L86 27L87 74L13 75ZM14 29L50 56L86 28" />}
      </g>
    </svg>
  );
}
