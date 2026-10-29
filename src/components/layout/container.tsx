import type { ReactNode } from 'react';

const baseClassName = 'mx-auto w-full max-w-[54rem] px-5 min-[681px]:px-8';

// サイト共通の横幅と左右余白。上下余白やページ固有の装飾は使う側で className に指定する。
// トップ（home-page.css の .kobo-home__shell）と同じく、中身は最大 800px、左右の余白は 32px（680px 以下は 20px）にして、
// ヘッダーのロゴや本文の位置をトップとそろえる
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ? `${baseClassName} ${className}` : baseClassName}>{children}</div>;
}
