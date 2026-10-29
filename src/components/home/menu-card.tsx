'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Blocks } from '@/components/home/blocks';
import { Cat } from '@/components/home/cat';
import { Character } from '@/components/home/character';
import { Flower } from '@/components/home/flower';
import { MenuIllustration } from '@/components/home/menu-illustration';
import { MenuTitle } from '@/components/page-transition';
import { menuCaptions, menuNames, type MenuSlug } from '@/lib/menu';

// クリックしてから移動するまでの待ち時間。home-page.css の動き（飛び出し 390ms・手を振る 60ms 後から 530ms・
// 積み木と星 260ms 後から 280ms）を見せ終わってから移動するよう、それより少し長くする
const exitDurationMs = 640;

// menu-title は、カードと各ページの見出しの間をタイトルが移動する遷移の印（globals.css でスマホの動きを調整する）
const transitionTypes = ['nav-forward', 'menu-title'];

// カードの後ろに隠れていて、カードの端から覗くもの
const peekers: Record<MenuSlug, ReactNode> = {
  about: <Character className="peek-card__character" />,
  works: <Blocks className="peek-card__character" />,
  blog: <Cat className="peek-card__character" />,
  contact: <Flower className="peek-card__character" />,
};

// マウスを置く・Tab で選ぶと、カードの後ろから覗く（home-page.css の :hover / :focus-visible）。
// クリック・タップ・Enter で飛び出して反応してから移動する。スマホは1回のタップで飛び出しから移動まで進む。
// onNavigate は Ctrl/Cmd クリックでは呼ばれないので、新しいタブで開く操作はブラウザ本来の動きのまま残る
export function MenuCard({ slug }: { slug: MenuSlug }) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const exitTimerRef = useRef<number | null>(null);

  // cacheComponents が有効だと、移動したあともトップは <Activity> で隠されるだけで state が残る。
  // 戻ってきたときに飛び出したまま・押しても反応しないままにならないよう、隠れるときに元へ戻す。
  // 待ち時間中に戻るボタンなどで先に別のページへ移った場合も、ここでタイマーを止めて移動を取り消す
  useLayoutEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      setIsLeaving(false);
    };
  }, []);

  return (
    <Link
      href={`/${slug}`}
      transitionTypes={transitionTypes}
      data-phase={isLeaving ? 'leaving' : undefined}
      onNavigate={(event) => {
        // 最初のクリックで移動を決めているので、待ち時間中にもう一度押されても何もしない
        if (exitTimerRef.current !== null) {
          event.preventDefault();
          return;
        }
        // 動きを減らす設定のときは、待たずにふつうのリンクとして移動する
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }
        event.preventDefault();
        setIsLeaving(true);
        exitTimerRef.current = window.setTimeout(() => {
          router.push(`/${slug}`, { transitionTypes });
        }, exitDurationMs);
      }}
      className={`peek-card peek-card--${slug} kobo-home__cardLink`}
    >
      <span aria-hidden className="peek-card__stage">
        {peekers[slug]}
      </span>
      <span className="kobo-home__cardFace">
        <span className="kobo-home__cardTitle"><MenuTitle slug={slug}>{menuNames[slug]}</MenuTitle></span>
        <span className="kobo-home__cardCaption">{menuCaptions[slug]}</span>
        <span className="kobo-home__illustration"><MenuIllustration slug={slug} /></span>
        <span className="kobo-home__cardArrow" aria-hidden>→</span>
      </span>
    </Link>
  );
}
