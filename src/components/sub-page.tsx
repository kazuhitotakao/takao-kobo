import type { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { MenuTitle, PageTransition } from '@/components/page-transition';
import { menuNames, type MenuSlug } from '@/lib/menu';

// トップには Header を出さないので、下層ページだけここで描画する。
// 下層ページ同士の遷移で Header と背景がスライドしないよう PageTransition の外に置く。
// 作品詳細のような一覧の下のページ（isDetail）では、メニュー名の見出しを出さず、h1 は children 側で描画する
export function SubPage({
  slug,
  isDetail = false,
  children,
}: {
  slug: MenuSlug;
  isDetail?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <Header currentSlug={slug} isDetail={isDetail} />
      <div className="flex-1 bg-sky-50">
        <PageTransition>
          <main className="py-12">
            <Container>
              {!isDetail && (
                <h1 className="text-3xl font-bold">
                  <MenuTitle slug={slug}>{menuNames[slug]}</MenuTitle>
                </h1>
              )}
              {children}
            </Container>
          </main>
        </PageTransition>
      </div>
    </>
  );
}
