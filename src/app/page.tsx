import type { Metadata } from 'next';
import { createPageMetadata, siteName } from '@/lib/metadata';
import { HomeHeader } from '@/components/home/home-header';
import { MenuCard } from '@/components/home/menu-card';
import { StepByStep } from '@/components/home/step-by-step';
import '@/components/home/home-page.css';
import { PageTransition } from '@/components/page-transition';
import { menuSlugs } from '@/lib/menu';

const homeTitle = `${siteName} | 一歩ずつ、つくっていく。`;
const homeDescription = 'Webエンジニアとしての制作と、日々の記録。';
const homeMetadata = createPageMetadata({ path: '/', description: homeDescription });

export const metadata: Metadata = {
  ...homeMetadata,
  title: { absolute: homeTitle },
  openGraph: { ...homeMetadata.openGraph, title: homeTitle },
  twitter: { ...homeMetadata.twitter, title: homeTitle },
};

// スクロールせずに一画面で見渡せるよう、ヘッダー・キャッチコピーと説明文・カードだけを置く。
export default function HomePage() {
  return (
    <PageTransition>
      <div className="kobo-home__home">
        <div className="kobo-home__shell">
          <HomeHeader />
          <main className="kobo-home__main">
            <section className="kobo-home__hero" aria-labelledby="home-title">
              <StepByStep />
              <h1 id="home-title" className="kobo-home__heroTitle">一歩ずつ、つくっていく。</h1>
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
