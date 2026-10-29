'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { takeScrollRestoration } from '@/lib/scroll-restoration';

// マウスで操作する画面（pointer: fine）で、下層ページの Header の下の本文だけをスクロールさせる要素（SubPage から使う）。
// ページ全体ではなくこの要素がスクロールするので、ふだんブラウザがしてくれることをここで補う。
// - 一覧へ戻るリンク・ブラウザの戻る・進む・リロードで、前に見ていた位置まで戻す
// - Header のリンクなど本文の外にフォーカスがあっても、キーボードで本文をスクロールできるようにする
// スマホなど指で操作する画面では、ページ全体のスクロール位置を保存・復元する

const storageKeyPrefix = 'sub-page-scroll:';

function currentUrl() {
  return location.pathname + location.search;
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
function restoreScrollTop(scrollArea: HTMLElement, content: Element | null, top: number, onFinish: () => void) {
  const apply = () => { scrollArea.scrollTop = top; };
  apply();
  // スマホではブラウザ自身の復元が後から走るので、描画後・load後にも合わせる。
  let secondFrame: number | undefined;
  const firstFrame = window.requestAnimationFrame(() => {
    apply();
    secondFrame = window.requestAnimationFrame(apply);
  });
  const observer = new ResizeObserver(apply);
  if (content) observer.observe(content);
  window.addEventListener('load', apply, { once: true });
  const cleanup = () => {
    observer.disconnect();
    window.cancelAnimationFrame(firstFrame);
    if (secondFrame !== undefined) window.cancelAnimationFrame(secondFrame);
    window.clearTimeout(timer);
    window.removeEventListener('load', apply);
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchstart', stop);
    window.removeEventListener('keydown', stop);
  };
  const stop = () => {
    cleanup();
    onFinish();
  };
  const timer = window.setTimeout(stop, 3000);
  // 復元待ちの途中で操作されたら、それ以降はユーザーのスクロールを優先する。
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', stop);
  return cleanup;
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
  const restorationRef = useRef<{ url: string; top: number } | null>(null);

  // 描画の前に位置を戻し、ページ遷移のアニメーションにも戻した位置で写るようにする
  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    const useWindowScroll = !window.matchMedia('(pointer: fine)').matches;
    const scrollElement = useWindowScroll ? document.scrollingElement : scrollArea;
    if (!(scrollElement instanceof HTMLElement)) return;
    const scrollTarget = useWindowScroll ? window : scrollArea;
    const content = useWindowScroll ? document.body : scrollArea.firstElementChild;
    const url = currentUrl();
    const key = storageKeyPrefix + url;
    if (restorationRef.current?.url !== url) restorationRef.current = null;
    if (takeScrollRestoration(url)) {
      restorationRef.current = { url, top: readScrollTop(key) };
    }
    // 読み込み中の再描画やStrict Modeの再実行でも、復元先の位置を保持する。
    const restoration = restorationRef.current;
    const stopRestoring = restoration
      ? restoreScrollTop(scrollElement, content, restoration.top, () => { restorationRef.current = null; })
      : undefined;

    let saveTimer: number | undefined;
    let savedTop = scrollElement.scrollTop;
    let isLeaving = false;
    const savePosition = () => writeScrollTop(key, restorationRef.current?.top ?? savedTop);
    const save = () => {
      if (isLeaving) return;
      savedTop = scrollElement.scrollTop;
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(savePosition, 100);
    };
    // スマホでは遷移先も同じdocumentを使うため、切り替え後の位置で元の保存値を上書きしない。
    const freezePosition = () => {
      isLeaving = true;
      window.clearTimeout(saveTimer);
      savePosition();
    };
    const handleLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const destination = new URL(link.href);
      if (destination.origin !== location.origin || destination.pathname + destination.search === url) return;
      savedTop = scrollElement.scrollTop;
      freezePosition();
    };
    scrollTarget.addEventListener('scroll', save, { passive: true });
    document.addEventListener('click', handleLinkClick, true);
    window.addEventListener('popstate', freezePosition);
    window.addEventListener('pagehide', savePosition);

    return () => {
      scrollTarget.removeEventListener('scroll', save);
      document.removeEventListener('click', handleLinkClick, true);
      window.removeEventListener('popstate', freezePosition);
      window.removeEventListener('pagehide', savePosition);
      window.clearTimeout(saveTimer);
      stopRestoring?.();
      // ページを離れる直前の位置も残す
      savePosition();
      if (isLeaving) restorationRef.current = null;
    };
    // クエリだけ変わったときも、保存先を新しいカテゴリ・ページ番号のURLに切り替える。
  });

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
