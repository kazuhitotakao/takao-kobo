import Image from 'next/image';
import { illustrationSources } from '@/lib/illustrations';
import type { MenuSlug } from '@/lib/menu';

export function MenuIllustration({ slug }: { slug: Exclude<MenuSlug, 'about'> }) {
  const src = illustrationSources[slug];
  if (src) {
    return <Image src={src} alt="" width={80} height={80} className="size-20 object-contain" />;
  }

  // 設定済みの画像を優先し、未設定の間だけ工房の仮イラストを使う。
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {slug === 'blog' && <><path d="M22 17L74 19V80L21 78ZM33 32H61M33 42H63M33 55H45V67H33ZM53 55H64M53 64H63" /><path d="M75 30L83 31V80H75" /></>}
        {slug === 'works' && <path d="M18 31L80 29L82 74L18 76ZM39 30V22H59L60 30M18 44Q48 56 81 44M45 48V57H56V48" />}
        {slug === 'contact' && <><path d="M49 54Q56 76 42 91M48 74Q28 76 29 64Q42 62 48 74M49 83Q67 82 68 70Q55 67 49 83" /><path d="M47 27Q39 10 31 20Q21 30 37 37Q19 42 28 52Q35 62 45 46Q51 65 62 55Q72 46 56 39Q76 37 68 25Q61 15 51 29Z" /><circle cx="47" cy="39" r="7" /></>}
      </g>
    </svg>
  );
}
