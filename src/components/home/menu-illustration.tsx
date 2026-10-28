import Image from 'next/image';
import { illustrationSources } from '@/lib/illustrations';
import type { MenuSlug } from '@/lib/menu';

export function MenuIllustration({ slug }: { slug: MenuSlug }) {
  // about の差し替え画像は後ろからのぞく人物（Character）に使うので、カードの絵はいつも線画にする。
  const src = slug === 'about' ? null : illustrationSources[slug];
  if (src) {
    return <Image src={src} alt="" width={80} height={80} className="size-20 object-contain" />;
  }

  // 設定済みの画像を優先し、未設定の間だけ工房の仮イラストを使う。
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* センター分け・角メガネ・柔らかい笑顔の男性（後ろからのぞく人物と同じく、四角い顔と山形の前髪） */}
        {slug === 'about' && <><path d="M30 31Q30 20 41 20H59Q70 20 70 31V58Q70 70 58 70H42Q30 70 30 58Z" /><path d="M30 46H27Q25 46 25 49V53Q25 56 27 56H30M70 46H73Q75 46 75 49V53Q75 56 73 56H70" /><path d="M28 43V30Q28 17 41 17H59Q72 17 72 30V43L50 25Z" fill="currentColor" /><path d="M50 18V25" stroke="#fff" strokeWidth="1.6" /><path d="M34 42H48V50H34ZM52 42H66V50H52ZM48 44H52M34 44H30M66 44H70" /><path d="M38 47.5Q41 45 44 47.5M56 47.5Q59 45 62 47.5M50 55V55.5M45 60Q50 64 55 60" /><path d="M45 70V76H34Q24 76 24 86V94M55 70V76H66Q76 76 76 86V94M45 76L50 81L55 76" /></>}
        {slug === 'blog' && <><path d="M22 17L74 19V80L21 78ZM33 32H61M33 42H63M33 55H45V67H33ZM53 55H64M53 64H63" /><path d="M75 30L83 31V80H75" /></>}
        {/* つくってきたもの：ノートパソコンとコードの記号（積み木はカードの後ろから覗く） */}
        {slug === 'works' && <><path d="M20 24L80 23L81 62L19 63ZM19 63L8 75L92 74L81 62M44 69H56" /><path d="M41 35L34 43L41 51M59 35L66 43L59 51M54 33L46 53" /></>}
        {/* お問い合わせ：封筒（花はカードの後ろから覗く） */}
        {slug === 'contact' && <path d="M14 28L86 27L87 74L13 75ZM14 29L50 56L86 28" />}
      </g>
    </svg>
  );
}
