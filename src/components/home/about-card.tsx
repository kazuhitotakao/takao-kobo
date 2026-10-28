'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import { Character } from '@/components/home/character';
import { MenuCardFace, menuCardClassName } from '@/components/home/menu-card';

// クリックしてから About me へ移動するまでの待ち時間。globals.css の飛び出し（390ms）と
// 手を振る動き（60ms 後から 530ms）を見せ終わってから移動するよう、それより少し長くする
const exitDurationMs = 640;

// マウスを置く・Tab で選ぶと、人物がカードの右から覗く（globals.css の :hover / :focus-visible）。
// クリック・タップ・Enter で人物が飛び出して手を振り、そのあと移動する。スマホは1回のタップで飛び出しから移動まで進む。
// onNavigate は Ctrl/Cmd クリックでは呼ばれないので、新しいタブで開く操作はブラウザ本来の動きのまま残る
export function AboutCard() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const exitTimerRef = useRef<number | null>(null);

  // cacheComponents が有効だと、移動したあともトップは <Activity> で隠されるだけで state が残る。
  // 戻ってきたときに人物が飛び出したまま・押しても反応しないままにならないよう、隠れるときに元へ戻す。
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
      href="/about"
      transitionTypes={['nav-forward']}
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
          router.push('/about', { transitionTypes: ['nav-forward'] });
        }, exitDurationMs);
      }}
      className={`about-card ${menuCardClassName}`}
    >
      <span aria-hidden className="about-card__stage">
        <Character className="about-card__character" />
      </span>
      <MenuCardFace slug="about" />
    </Link>
  );
}
