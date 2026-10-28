import Image from 'next/image';
import { illustrationSources } from '@/lib/illustrations';
import type { MenuSlug } from '@/lib/menu';

// About me 以外のカードに添える仮の線画（About me はカードの後ろの人物 Character を使う）
function Placeholder({ slug }: { slug: Exclude<MenuSlug, 'about'> }) {
  switch (slug) {
    case 'works':
      return (
        <>
          <rect x="14" y="16" width="52" height="36" rx="4" fill="#e0f2fe" />
          <path d="M6 58 H74 L70 64 H10 Z" />
          <path d="M33 28 L27 34 L33 40 M47 28 L53 34 L47 40 M43 26 L37 42" fill="none" />
        </>
      );
    case 'blog':
      return (
        <>
          <rect x="12" y="12" width="42" height="56" rx="4" />
          <path d="M22 26 H44 M22 35 H44 M22 44 H36" fill="none" />
          <path d="M50 64 L52 56 L66 26 L73 29.5 L59 59.5 Z" fill="#e0f2fe" />
          <path d="M52 56 L59 59.5" fill="none" />
        </>
      );
    case 'contact':
      return (
        <>
          <rect x="10" y="20" width="60" height="42" rx="4" fill="#e0f2fe" />
          <path d="M12 23 L40 44 L68 23" fill="none" />
        </>
      );
  }
}

export function MenuIllustration({ slug }: { slug: Exclude<MenuSlug, 'about'> }) {
  const src = illustrationSources[slug];
  if (src) {
    return <Image src={src} alt="" width={80} height={80} className="size-20 object-contain" />;
  }

  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className="size-20 text-navy"
      fill="#fff"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Placeholder slug={slug} />
    </svg>
  );
}
