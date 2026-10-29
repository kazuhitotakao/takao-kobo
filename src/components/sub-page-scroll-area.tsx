'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';

// マウスで操作する画面（pointer: fine）で、下層ページの Header の下の本文だけをスクロールさせる要素（SubPage から使う）。
// ページ全体ではなくこの要素がスクロールするので、ふだんブラウザがしてくれることをここで補う。
// - 戻る・進むやリロードで来たときに、前に見ていた位置まで戻す
// - Header のリンクなど本文の外にフォーカスがあっても、キーボードで本文をスクロールできるようにする
// スマホなど指で操作する画面ではページ全体がスクロールし、この要素はスクロールしないので、どちらもブラウザに任せる

const storageKeyPrefix = 'sub-page-scroll:';

function currentUrl() {
  return location.pathname + location.search;
}

// 位置を戻すページの URL。戻る・進む（popstate）と、リロードなどで開き直したページを入れ、次に表示したときに使い切る
let restoreTarget: string | null = null;
if (typeof window !== 'undefined') {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (navigation?.type === 'reload' || navigation?.type === 'back_forward') {
    const url = new URL(navigation.name);
    restoreTarget = url.pathname + url.search;
  }
  window.addEventListener('popstate', () => {
    restoreTarget = currentUrl();
  });
}

function readScrollTop(key: string) {
  try {
    return Number(sessionStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function writeScrollTop(key: string, scrollTop: number) {
  try {
    sessionStorage.setItem(key, String(Math.round(scrollTop)));
  } catch {
    // 保存できないブラウザでは、位置を戻さないだけにする
  }
}

// 記事の本文など、あとから読み込まれて高さが伸びる途中だと届かないので、伸びるたびに少しのあいだ合わせ直す
function restoreScrollTop(scrollArea: HTMLElement, top: number) {
  scrollArea.scrollTop = top;
  const content = scrollArea.firstElementChild;
  if (scrollArea.scrollTop >= top - 1 || !content) {
    return;
  }
  const observer = new ResizeObserver(() => {
    scrollArea.scrollTop = top;
    if (scrollArea.scrollTop >= top - 1) {
      observer.disconnect();
    }
  });
  observer.observe(content);
  window.setTimeout(() => observer.disconnect(), 1000);
}

// ブラウザのキーボードスクロールに合わせた移動量。対象外のキーなら null
function keyScrollDistance(event: KeyboardEvent, scrollArea: HTMLElement) {
  // 1画面分は、前の画面の終わりが少し残るように 87.5% だけ動かす
  const page = scrollArea.clientHeight * 0.875;
  if (event.key === ' ') {
    return event.shiftKey ? -page : page;
  }
  if (event.shiftKey) {
    return null;
  }
  switch (event.key) {
    case 'ArrowDown':
      return 40;
    case 'ArrowUp':
      return -40;
    case 'PageDown':
      return page;
    case 'PageUp':
      return -page;
    case 'Home':
      return -scrollArea.scrollTop;
    case 'End':
      return scrollArea.scrollHeight - scrollArea.scrollTop;
    default:
      return null;
  }
}

export function SubPageScrollArea({ className, children }: { className: string; children: ReactNode }) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 描画の前に位置を戻し、ページ遷移のアニメーションにも戻した位置で写るようにする
  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    const url = currentUrl();
    const key = storageKeyPrefix + url;
    if (restoreTarget === url) {
      restoreScrollTop(scrollArea, readScrollTop(key));
    }
    restoreTarget = null;

    let saveTimer: number | undefined;
    const save = () => {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => writeScrollTop(key, scrollArea.scrollTop), 100);
    };
    scrollArea.addEventListener('scroll', save, { passive: true });

    return () => {
      scrollArea.removeEventListener('scroll', save);
      window.clearTimeout(saveTimer);
      // ページを離れる直前の位置も残す
      writeScrollTop(key, scrollArea.scrollTop);
    };
  }, []);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      // 何もフォーカスしていないときと、本文の外のリンク（Header のメニューなど）にいるときだけ引き受ける。
      // 本文の中や、入力欄・ボタンにフォーカスがあるときはブラウザに任せる
      const { target } = event;
      const isOutsideFocus =
        target === document.body || (target instanceof HTMLAnchorElement && !scrollArea.contains(target));
      // スクロールしない画面（スマホや、本文が短いページ）ではブラウザに任せる
      if (!isOutsideFocus || scrollArea.scrollHeight <= scrollArea.clientHeight) {
        return;
      }
      const distance = keyScrollDistance(event, scrollArea);
      if (distance === null) {
        return;
      }
      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scrollArea.scrollBy({ top: distance, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={scrollAreaRef} className={className}>
      {children}
    </div>
  );
}
