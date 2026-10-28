import { AboutCard } from '@/components/home/about-card';
import { HomeHeader } from '@/components/home/home-header';
import { MenuCard } from '@/components/home/menu-card';
import { StepByStep } from '@/components/home/step-by-step';
import '@/components/home/home-page.css';
import { PageTransition } from '@/components/page-transition';
import type { MenuSlug } from '@/lib/menu';

// トップでの並び順だけを変え、下層ページのヘッダーメニューには影響させない。
const homeMenuSlugs = ['about', 'blog', 'works', 'contact'] as const satisfies readonly MenuSlug[];

// スクロールせずに一画面で見渡せるよう、ヘッダー・キャッチコピー・カードだけを置く。
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
              <p className="kobo-home__heroCopy">考えて、試して、ときどき寄り道。</p>
            </section>
            <nav className="kobo-home__menu" aria-label="メインメニュー">
              <ul className="kobo-home__cardGrid">
                {homeMenuSlugs.map((slug) => (
                  <li key={slug} className={slug === 'about' ? 'kobo-home__aboutEntry' : undefined}>
                    {slug === 'about' ? <AboutCard /> : <MenuCard slug={slug} />}
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
