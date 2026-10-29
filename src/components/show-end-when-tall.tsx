'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// children が画面の高さより長いときだけ、その下に end を出す。
// 記事の終わりまでスクロールすると上のリンクが見えなくなる長さのときだけ、下にも同じリンクを置くために使う。
// 高さは画面サイズや画像の読み込みで変わるので、ブラウザで測って追いかける（JS が動くまでは end を出さない）
export function ShowEndWhenTall({ children, end }: { children: ReactNode; end: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTall, setIsTall] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    const update = () => setIsTall(content.getBoundingClientRect().height > window.innerHeight);
    // ResizeObserver は監視を始めた時点でも1回呼ばれるので、初回の判定もここで行われる
    const observer = new ResizeObserver(update);
    observer.observe(content);
    // 中身が変わらず画面の高さだけ変わったとき（ウィンドウの縦方向のリサイズなど）用
    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div ref={contentRef}>{children}</div>
      {isTall && end}
    </>
  );
}
