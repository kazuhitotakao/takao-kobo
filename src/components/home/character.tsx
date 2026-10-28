import Image from 'next/image';
import { illustrationSources } from '@/lib/illustrations';

// About me カードの後ろから覗く人物（センター分け・眼鏡・手を振る姿の仮の線画）。
// カードの右端から覗いたときに見えるよう、顔と振る手を右寄りに描いている。
// character__ で始まる class は globals.css の動き（口・ほっぺ・腕）と対応している
export function Character({ className }: { className?: string }) {
  const src = illustrationSources.about;
  if (src) {
    return <Image src={src} alt="" width={128} height={180} className={className} />;
  }

  return (
    <svg
      viewBox="0 0 128 180"
      aria-hidden
      overflow="visible"
      className={`text-navy ${className ?? ''}`}
      fill="#fff"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 首・体（下端はカードの下で切れる） */}
      <rect x="65" y="88" width="14" height="22" />
      <path d="M30 184 C30 134 46 110 72 108 C98 110 114 134 114 184" fill="#e0f2fe" />
      <path d="M64 108 L72 120 L80 108" fill="none" />

      {/* 耳・顔 */}
      <circle cx="42" cy="68" r="6" />
      <circle cx="102" cy="68" r="6" />
      <ellipse cx="72" cy="64" rx="30" ry="32" />

      {/* センター分けの髪 */}
      <path
        d="M42 66 C39 38 55 25 72 25 C89 25 105 38 102 66 C98 52 86 40 72 35 C58 40 46 52 42 66 Z"
        fill="currentColor"
      />
      <path d="M72 28 V34" stroke="#fff" strokeWidth="1.5" />

      {/* 眼鏡と目 */}
      <g fill="none">
        <circle cx="60" cy="68" r="8.5" />
        <circle cx="84" cy="68" r="8.5" />
        <path d="M68.5 67 Q72 64.5 75.5 67 M51.5 66 L44 63 M92.5 66 L100 63" />
      </g>
      <circle cx="60" cy="69" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="84" cy="69" r="1.8" fill="currentColor" stroke="none" />

      {/* ほっぺと口。ふだんは口を小さく閉じ、手を振るときは笑顔にしてほっぺを出す */}
      <circle className="character__cheek" cx="53" cy="82" r="4" fill="#fda4af" stroke="none" />
      <circle className="character__cheek" cx="91" cy="82" r="4" fill="#fda4af" stroke="none" />
      <path className="character__mouth-calm" d="M67 85 Q72 88 77 85" fill="none" />
      <path className="character__mouth-smile" d="M64 83 Q72 96 80 83 Z" fill="currentColor" />

      {/* 振る腕。紺の太線に細い水色の線を重ねて、縁取りのある袖にする */}
      <g className="character__arm">
        <path d="M100 126 Q114 110 112 86" fill="none" strokeWidth="11" />
        <path d="M100 126 Q114 110 112 86" fill="none" stroke="#e0f2fe" strokeWidth="6" />
        <circle cx="112" cy="79" r="7.5" />
      </g>
    </svg>
  );
}
