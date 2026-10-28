import type { ReactNode } from 'react';

const baseClassName = 'mx-auto w-full max-w-3xl px-6';

// サイト共通の横幅と左右余白。上下余白やページ固有の装飾は使う側で className に指定する
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ? `${baseClassName} ${className}` : baseClassName}>{children}</div>;
}
