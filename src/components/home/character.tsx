import Image from 'next/image';
import { illustrationSources } from '@/lib/illustrations';

// About me カードの後ろから覗く人物（センター分け・角メガネ・手を振る姿の仮の線画）。
// 丸みを抑えて、四角い顔・山形の前髪・四角い眼鏡・角ばった肩で描いている。
// カードの右端から覗いたときに見えるよう、顔と振る手を右寄りに描いている。
// character__ で始まる class は home-page.css の動き（口・ほっぺ・腕）と対応している
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
      <rect x="65" y="92" width="14" height="18" />
      <path d="M30 184 V128 Q30 110 48 110 H96 Q114 110 114 128 V184" fill="#e0f2fe" />
      <path d="M64 110 L72 120 L80 110" fill="none" />

      {/* 耳・顔 */}
      <rect x="37" y="62" width="8" height="14" rx="3" />
      <rect x="99" y="62" width="8" height="14" rx="3" />
      <path d="M42 40 Q42 30 52 30 H92 Q102 30 102 40 V84 Q102 98 88 98 H56 Q42 98 42 84 Z" />

      {/* センター分けの髪。前髪は分け目から両脇へ山形に下ろす */}
      <path d="M40 66 V40 Q40 27 53 27 H91 Q104 27 104 40 V66 L72 37 Z" fill="currentColor" />
      <path d="M72 28 V36" stroke="#fff" strokeWidth="1.5" />

      {/* 角メガネと目・鼻 */}
      <g fill="none">
        <rect x="50" y="60" width="18" height="13" rx="2" />
        <rect x="76" y="60" width="18" height="13" rx="2" />
        <path d="M68 63 H76 M50 63 H42 M94 63 H102" />
      </g>
      <circle cx="59" cy="67" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="85" cy="67" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="72" cy="79" r="1.6" fill="currentColor" stroke="none" />

      {/* ほっぺと口。ふだんは口を小さく閉じ、手を振るときは口を大きく開けた笑顔にしてほっぺを出す */}
      <circle className="character__cheek" cx="54" cy="84" r="4" fill="#fda4af" stroke="none" />
      <circle className="character__cheek" cx="90" cy="84" r="4" fill="#fda4af" stroke="none" />
      <path className="character__mouth-calm" d="M67 87 Q72 90 77 87" fill="none" />
      <path className="character__mouth-smile" d="M64 85 H80 Q80 93 72 93 Q64 93 64 85 Z" fill="currentColor" />

      {/* 振る腕。紺の太線に細い水色の線を重ねて、縁取りのある袖にする */}
      <g className="character__arm">
        <path d="M100 126 L116 108 L112 88" fill="none" strokeWidth="11" />
        <path d="M100 126 L116 108 L112 88" fill="none" stroke="#e0f2fe" strokeWidth="6" />
        <rect x="104" y="72" width="16" height="16" rx="5" />
      </g>
    </svg>
  );
}
