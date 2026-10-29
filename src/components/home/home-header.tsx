import { Logo } from '@/components/layout/logo';

// トップ専用。下層ページの Header・ナビゲーションには影響させない（ロゴだけは下層ページと共通）。
// トップそのものにいるので、ロゴはトップへのリンクにしない
export function HomeHeader() {
  return (
    <header className="site-header kobo-home__header">
      <Logo />
    </header>
  );
}
