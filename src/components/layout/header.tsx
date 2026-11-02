import Link from 'next/link';
import { ViewTransition } from 'react';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';
import { menuNames, menuSlugs, type MenuSlug } from '@/lib/menu';

const focusOutlineClassName = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

// 各ページの h1 と重ならないよう、工房名は見出しにせずリンクだけにする。
// currentSlug のメニューを今いる場所として色付けする。作品詳細のような一覧の下のページ（isDetail）は
// メニューのページそのものではないので、aria-current を page ではなく true にする。
// 上下の余白はトップのヘッダーとそろえ、背景と境界線は共通の site-header で淡い水色にする。
// スマホではページ全体がスクロールするので上に貼り付ける（SubPage を参照）。
// view-transition-name はトップのヘッダーと同じにして、トップとの行き来でもロゴをその場に留める。
// あわせて、スクロールした本文の画像がページ遷移中にヘッダーの上に重ならないよう、ヘッダーを手前に描かせる。
// メニュー同士の移動では、今いる場所を示す白い丸枠を、押したメニューまで滑らせる（globals.css の .nav-indicator）。
// 丸枠がメニュー名の上に重ならないよう、メニュー名にもそれぞれ名前を付けて、丸枠より手前に描かせる
export function Header({ currentSlug, isDetail = false }: { currentSlug?: MenuSlug; isDetail?: boolean }) {
  return (
    <header className="site-header sticky top-0 z-20 [view-transition-name:site-header]">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-2.5 min-[681px]:py-3">
        {/* 見出しのあるページからトップへ戻るときは、見出しがトップのカードへ移動する（menu-title は menu-card.tsx を参照） */}
        <Link
          href="/"
          transitionTypes={currentSlug && !isDetail ? ['nav-back', 'menu-title'] : ['nav-back']}
          className={`flex rounded-sm text-navy transition-colors hover:text-sky-700 ${focusOutlineClassName}`}
        >
          <Logo />
        </Link>
        {/* スマホでは工房名の下の1行に4つを広げて並べ、押しやすくする */}
        <nav aria-label="メインメニュー" className="w-full sm:w-auto">
          <ul className="flex flex-wrap justify-between gap-1 sm:justify-end sm:gap-2">
            {menuSlugs.map((slug) => {
              const isCurrent = slug === currentSlug;
              return (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    transitionTypes={['nav-forward']}
                    aria-current={isCurrent ? (isDetail ? 'true' : 'page') : undefined}
                    className={`relative block rounded-full px-2.5 py-2 text-[15px] font-semibold whitespace-nowrap transition motion-safe:active:scale-95 sm:px-4 sm:text-lg ${
                      isCurrent ? 'text-sky-900' : 'text-slate-700 hover:bg-white/60 hover:text-sky-800'
                    } ${focusOutlineClassName}`}
                  >
                    {isCurrent && (
                      <ViewTransition name="nav-indicator" share="nav-indicator" default="none">
                        <span aria-hidden className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-sky-200" />
                      </ViewTransition>
                    )}
                    <span className="relative [view-transition-class:nav-label]" style={{ viewTransitionName: `nav-label-${slug}` }}>
                      {menuNames[slug]}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
