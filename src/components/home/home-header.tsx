import { Logo } from '@/components/layout/logo';

// トップ専用。下層ページの Header・ナビゲーションには影響させない（ロゴだけは下層ページと共通）。
// トップそのものにいるので、ロゴはトップへのリンクにしない。
// 検索結果のタイトルが title（髙尾工房 | …）どおり工房名から始まるよう、トップでは工房名を h1 にする
export function HomeHeader() {
  return (
    <header className="site-header kobo-home__header">
      <h1 className="flex">
        <Logo />
      </h1>
    </header>
  );
}
