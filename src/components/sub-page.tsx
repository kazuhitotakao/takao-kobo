import type { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { MenuTitle, PageTransition } from '@/components/page-transition';
import { SubPageScrollArea } from '@/components/sub-page-scroll-area';
import { menuNames, type MenuSlug } from '@/lib/menu';

// トップには Header を出さないので、下層ページだけここで描画する。
// 下層ページ同士の遷移で Header と背景がスライドしないよう PageTransition の外に置く。
// 作品詳細のような一覧の下のページ（isDetail）では、メニュー名の見出しを出さず、h1 は children 側で描画する。
// 404 やエラーのようにどのメニューにも属さないページは slug を渡さず、h1 は children 側で描画する。
// マウスで操作する画面（pointer: fine）では、画面の高さに収めて Header の下の本文だけをスクロールさせ、
// 縦のスクロールバーを Header の横に出さない。本文側はスクロールバーの幅をいつも空けておき（scrollbar-gutter）、
// 本文の長さでスクロールバーが出たり消えたりしても、Header も本文も横にずれないようにする。
// スマホなど指で操作する画面は、スクロールバーが幅を取らないので、ページ全体をスクロールさせて Header を上に貼り付ける
// （アドレスバーが縮む・戻ったときにスクロール位置が戻るなど、ブラウザの動きをそのまま使う）
export function SubPage({
  slug,
  isDetail = false,
  children,
}: {
  slug?: MenuSlug;
  isDetail?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col pointer-fine:h-dvh">
      <Header currentSlug={slug} isDetail={isDetail} />
      <SubPageScrollArea className="site-page-background flex-1 pointer-fine:min-h-0 pointer-fine:overflow-y-auto pointer-fine:scrollbar-gutter-stable">
        <PageTransition>
          {/* 本文は右にスクロールバーの幅が空くので、左にも同じだけ（画面が狭くて余白が足りなければその分だけ）あけて、
              Container（max-w-[54rem]）の位置を Header とそろえる。100vw - 100% がスクロールバーの幅になる */}
          <main className="py-12 pointer-fine:pl-[min(100vw-100%,max(0px,(100vw-54rem)/2))]">
            <Container>
              {/* sub-page__title は、トップのカードから来たときに、続く本文を遅れて出す目印（globals.css を参照） */}
              {slug && !isDetail && (
                <h1 className="sub-page__title text-3xl font-bold">
                  <MenuTitle slug={slug}>{menuNames[slug]}</MenuTitle>
                </h1>
              )}
              {children}
            </Container>
          </main>
        </PageTransition>
      </SubPageScrollArea>
    </div>
  );
}
