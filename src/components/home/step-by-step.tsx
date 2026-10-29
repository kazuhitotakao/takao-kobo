'use client';

import { useEffect, useRef, useState } from 'react';

// 人物の状態。登っている → こちらを向く → 正面で待機 ⇄（押すと）喜んでいる
type ClimberPhase = 'climbing' | 'turning' | 'idle' | 'cheering';

// 階段を一歩ずつ登る人物と「step by step」の文字。トップのキャッチコピーの上に置き、サイトの合言葉を絵で見せる。
// トップを開くたびに人物が下から登り、途中で一度立ち止まって見上げ、いちばん上の段で止まる（home-page.css の climber-）。
// 登りきったらこちらを向いて待機。全体のホバーで右手を上げ、押す・タップすると両手を上げて喜び、正面の通常姿勢に戻る
export function StepByStep() {
  const [phase, setPhase] = useState<ClimberPhase>('climbing');
  // 喜び終えた後は、カーソルが残っていても挨拶を再開せず、次に乗せたときだけ右手を上げる
  const [isGreeting, setIsGreeting] = useState(false);
  // 人物を描き直して、登る CSS アニメーションを最初から始めるときに増やす
  const [climbCount, setClimbCount] = useState(0);
  const bodyRef = useRef<SVGGElement>(null);

  // 登り終えたらこちらを向く動きに移る。読み込みが遅くて React の準備より先に登り終えていても取りこぼさないよう、
  // animationend ではなく CSS アニメーションの finished を待つ（動きを減らす設定ではアニメーションがないので、すぐこちらを向く）。
  // 途中で動きを減らす設定に切り替えるなどして取り消されたときも、絵は登りきった姿勢になるのでこちらを向く
  useEffect(() => {
    let isActive = true;
    const climbs = bodyRef.current?.getAnimations().filter((animation) => animation instanceof CSSAnimation && animation.animationName === 'climber-climb') ?? [];
    const arrive = () => {
      if (isActive) setPhase((current) => (current === 'climbing' ? 'turning' : current));
    };
    Promise.all(climbs.map((animation) => animation.finished)).then(arrive, arrive);
    // cacheComponents が有効だと、別のページへ移ってもトップは <Activity> で隠されるだけで state が残る。
    // 隠れるときに登る前へ戻しておくと、戻ってきて見えたときに CSS アニメーションが最初から始まる
    // （隠れているあいだは display: none なので、動きも止まって重ならない）
    return () => {
      isActive = false;
      setIsGreeting(false);
      setPhase('climbing');
    };
  }, [climbCount]);

  // 振り向き・喜びが終わったら正面で待機。動きの設定変更で取り消されたときも待機へ戻す
  useEffect(() => {
    if (phase !== 'turning' && phase !== 'cheering') return;
    let isActive = true;
    const animationName = phase === 'turning' ? 'climber-turn' : 'climber-cheer';
    const motions = bodyRef.current?.getAnimations().filter((animation) => animation instanceof CSSAnimation && animation.animationName === animationName) ?? [];
    const rest = () => {
      if (!isActive) return;
      setIsGreeting(false);
      setPhase((current) => (current === phase ? 'idle' : current));
    };
    Promise.all(motions.map((animation) => animation.finished)).then(rest, rest);
    return () => { isActive = false; };
  }, [phase]);

  // ブラウザの戻る・進むで、ページがそのまま復元されたとき（bfcache）も最初から登らせる
  useEffect(() => {
    const climbAgain = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setIsGreeting(false);
      setPhase('climbing');
      setClimbCount((count) => count + 1);
    };
    window.addEventListener('pageshow', climbAgain);
    return () => window.removeEventListener('pageshow', climbAgain);
  }, []);

  return (
    <button
      type="button"
      className="kobo-home__signature"
      data-phase={phase}
      aria-label="step by step、一歩ずつ。押すと人物が喜びます"
      onPointerEnter={(event) => {
        if (phase === 'idle' && event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
          setIsGreeting(true);
        }
      }}
      onPointerLeave={() => {
        if (phase !== 'cheering') setIsGreeting(false);
      }}
      onClick={(event) => {
        // 待機中だけ反応する。動いている途中のクリックは無視して、動きが重なって崩れないようにする
        if (phase !== 'idle' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        // 手を上げ下げする途中なら、その姿勢にそろえてから喜ぶ
        for (const animation of event.currentTarget.getAnimations({ subtree: true })) {
          if (animation instanceof CSSTransition) animation.finish();
        }
        setPhase('cheering');
      }}
    >
      <span className="kobo-home__signatureLabel" lang="en">step by step</span>
      <svg className="kobo-home__staircase" viewBox="0 0 180 112" fill="none" overflow="visible" aria-hidden focusable="false">
        <path d="M8 103H37V84H69V65H101V46H133V27H172V108H8Z" fill="var(--background)" />
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 103L37 102V84L69 83V65L101 64V46L133 45V27L172 26" />
          <path d="M13 108H169" strokeWidth="1.2" opacity=".22" />
          {/* 人物。登りきった姿勢で描き、腰を原点にしていちばん上の段に置く。登っている途中・喜んでいる姿勢は CSS で関節を回して作る */}
          <g key={climbCount} transform="translate(153 0)">
            <g
              className="climber"
              data-phase={phase}
              data-greeting={isGreeting}
            >
              {/* 枠から上にはみ出す人物も、頭のまわりまで押せるようにする */}
              <rect x="-16" y="-40" width="34" height="68" fill="transparent" stroke="none" />
              <g ref={bodyRef} className="climber__body">
                {/* 横を向いた体（登っているとき）。腕と脚は関節ごとに回して登る姿勢を作る */}
                <g className="climber__side">
                  <g transform="translate(0 -14.5)">
                    <path className="climber__arm climber__arm--a" d="M0 0V9L5.2 16.4" />
                  </g>
                  <Leg side="a" />
                  <path d="M0 -18.8L-4 -11.3L-4.9 -.6L6.1 1.3L7.7 -10.7Z" fill="#fff" />
                  <Leg side="b" />
                  <g transform="translate(0 -14.5)">
                    <path className="climber__arm climber__arm--b" d="M0 0V9L5.2 16.4" />
                  </g>
                </g>
                {/* こちらを向いた体（登りきった後）。頭の真下にくるよう、頭の中心へずらして置く */}
                <g className="climber__front" transform="translate(1.6 0)">
                  <FrontLeg side="left" />
                  <FrontLeg side="right" />
                  <path d="M0 -18.8L-5.5 -15.5L-4.8 1L4.8 1L5.5 -15.5Z" fill="#fff" />
                  <FrontArm side="left" />
                  <FrontArm side="right" />
                </g>
                {/* 両手を上げる瞬間に、頭の上へ喜びの効果線を出す */}
                <g transform="translate(1.6 -30)" strokeWidth="1.6" pointerEvents="none">
                  <g className="climber__cheer-rays">
                    <path d="M-15 -3L-20 -6" />
                    <path d="M-9 -10L-12 -16" />
                    <path d="M0 -12V-19" />
                    <path d="M9 -10L12 -16" />
                    <path d="M15 -3L20 -6" />
                  </g>
                </g>
                {/* 頭は首の付け根を原点にして、見上げる・首をかしげる動きを首から回す */}
                <g transform="translate(0 -18.8)">
                  <g className="climber__head">
                    <path d="M-6 -12Q-5 -18 2 -17Q10 -17 9 -9Q8 -2 1 -2Q-6 -3 -6 -10Z" fill="#fff" />
                    <g className="climber__face climber__face--side">
                      <path d="M-6 -12Q-3 -19 3 -17Q9 -17 9 -11L2 -14L-5 -10" fill="currentColor" strokeWidth="1.4" />
                      <path d="M6 -9H9" strokeWidth="1.3" />
                    </g>
                    <g className="climber__face climber__face--front">
                      <path d="M-6 -11Q-4.5 -18.5 1.5 -17.6Q8 -17.5 9.2 -11L5.5 -13.8L1.5 -12.6L-2.5 -13.8Z" fill="currentColor" strokeWidth="1.4" />
                      <circle cx="-.8" cy="-8.8" r=".9" fill="currentColor" stroke="none" />
                      <circle cx="4" cy="-8.8" r=".9" fill="currentColor" stroke="none" />
                      <path d="M.3 -5.6Q1.6 -4.5 2.9 -5.6" strokeWidth="1" />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </button>
  );
}

// こちらを向いた体の腕と脚。右側（絵の右）の形で描き、左側は左右を反転して置く。
// 反転した側は回す向きも逆になるので、同じ回転の値で左右対称に動く（両手を上げる・ひざを外へ曲げる）
const frontMirror = { left: 'scale(-1 1)', right: '' };

// 腕全体を肩、肘から先を肘を原点にして回す
function FrontArm({ side }: { side: 'left' | 'right' }) {
  return (
    <g transform={`${frontMirror[side]} translate(5.2 -15.3)`}>
      <g className={`climber__front-arm climber__front-arm--${side}`}>
        <path d="M0 0L1 8.5" />
        <g transform="translate(1 8.5)">
          <path className="climber__front-forearm" d="M0 0L.5 8.5" />
        </g>
      </g>
    </g>
  );
}

// 太もも・すね・足を、それぞれ付け根（腰・膝・足首）を原点にして回す。足先は外へ向ける
function FrontLeg({ side }: { side: 'left' | 'right' }) {
  return (
    <g transform={`${frontMirror[side]} translate(2 0)`}>
      <g className="climber__front-thigh">
        <path d="M0 0V12.5" />
        <g transform="translate(0 12.5)">
          <g className="climber__front-shin">
            <path d="M0 0V12.5" />
            <g transform="translate(0 12.5)">
              <path className="climber__front-foot" d="M0 0H3.5" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

// 横を向いた体の脚。太もも・すね・足を、それぞれ付け根（腰・膝・足首）を原点にして回す
function Leg({ side }: { side: 'a' | 'b' }) {
  return (
    <g transform={`translate(${side === 'a' ? -1.5 : 1.5} 0)`}>
      <g className={`climber__thigh climber__thigh--${side}`}>
        <path d="M0 0V12.5" />
        <g transform="translate(0 12.5)">
          <g className={`climber__shin climber__shin--${side}`}>
            <path d="M0 0V12.5" />
            <g transform="translate(0 12.5)">
              <path className={`climber__foot climber__foot--${side}`} d="M0 0H6.5" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}
