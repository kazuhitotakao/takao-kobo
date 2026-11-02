import type { Metadata } from 'next';
import { createPageMetadata, siteAlternateNames, siteName, siteUrl } from '@/lib/metadata';
import { HomeHeader } from '@/components/home/home-header';
import { JsonLd } from '@/components/json-ld';
import { MenuCard } from '@/components/home/menu-card';
import { StepByStep } from '@/components/home/step-by-step';
import '@/components/home/home-page.css';
import { PageTransition } from '@/components/page-transition';
import { menuSlugs } from '@/lib/menu';

const homeShareTitle = '一歩ずつ、つくっていく。';
const homeTitle = `${siteName} | ${homeShareTitle}`;
const homeDescription = 'Webエンジニアとしての制作と、日々の記録。';
// 検索結果に出す説明。画面に出す短い説明だけだと、Google が本文をつなぎ合わせた読みにくい説明を出すので、別に用意する
const homeSearchDescription =
  '髙尾工房は、Webエンジニアとして制作したアプリや、Web開発で学んだこと、釣り・家庭菜園・子育てなど日々の出来事を、一歩ずつ記録していく小さな工房です。';
const homeMetadata = createPageMetadata({ path: '/', description: homeDescription });

export const metadata: Metadata = {
  ...homeMetadata,
  title: { absolute: homeTitle },
  description: homeSearchDescription,
  openGraph: { ...homeMetadata.openGraph, title: homeShareTitle },
  twitter: { ...homeMetadata.twitter, title: homeShareTitle },
};

// 検索結果に出すサイト名を Google に伝える構造化データ。Google の決まりでトップページに置く
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  alternateName: siteAlternateNames,
  url: siteUrl.href,
};

// スクロールせずに一画面で見渡せるよう、ヘッダー・キャッチコピーと説明文・カードだけを置く。
export default function HomePage() {
  return (
    <PageTransition>
      <JsonLd data={websiteJsonLd} />
      <div className="kobo-home__home">
        <div className="kobo-home__shell">
          <HomeHeader />
          <main className="kobo-home__main">
            <section className="kobo-home__hero" aria-labelledby="home-title">
              <StepByStep />
              <p id="home-title" className="kobo-home__heroTitle">一歩ずつ、つくっていく。</p>
              <p className="kobo-home__heroDescription">{homeDescription}</p>
            </section>
            <nav className="kobo-home__menu" aria-label="メインメニュー">
              <ul className="kobo-home__cardGrid">
                {menuSlugs.map((slug) => (
                  <li key={slug} className={`kobo-home__${slug}Entry`}>
                    <MenuCard slug={slug} />
                  </li>
                ))}
              </ul>
            </nav>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
