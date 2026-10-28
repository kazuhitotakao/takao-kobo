import { AboutCard } from '@/components/home/about-card';
import { HomeHeader } from '@/components/home/home-header';
import { MenuCard } from '@/components/home/menu-card';
import '@/components/home/home-page.css';
import { PageTransition } from '@/components/page-transition';
import type { MenuSlug } from '@/lib/menu';

// トップでの並び順だけを変え、下層ページのヘッダーメニューには影響させない。
const homeMenuSlugs = ['about', 'blog', 'works', 'contact'] as const satisfies readonly MenuSlug[];

export default function HomePage() {
  return (
    <PageTransition>
      <div className="kobo-home__home">
        <a href="#home-main" className="kobo-home__skipLink">本文へ移動</a>
        <div className="kobo-home__shell">
          <HomeHeader />
          <main id="home-main">
            <section className="kobo-home__hero" aria-labelledby="home-title">
              <p className="kobo-home__eyebrow"><span aria-hidden />ENGINEER’S LITTLE WORKSHOP</p>
              <h1 id="home-title" className="kobo-home__heroTitle">
                一歩ずつ、<br className="kobo-home__mobileBreak" />つくっていく<span>。</span>
              </h1>
              <p className="kobo-home__heroCopy">考えて、試して、ときどき寄り道。<br />髙尾工房へ、ようこそ。</p>
              <span className="kobo-home__heroSpark" aria-hidden>✳</span>
            </section>
            <nav className="kobo-home__entrances" aria-label="工房の入り口">
              <div className="kobo-home__sectionCaption">
                <span>工房の入り口</span><span className="kobo-home__captionLine" aria-hidden /><span>TAKE A LOOK AROUND</span>
              </div>
              <ul className="kobo-home__cardGrid">
                {homeMenuSlugs.map((slug) => (
                  <li key={slug} className={slug === 'about' ? 'kobo-home__aboutEntry' : undefined}>
                    {slug === 'about' ? (
                      <>
                        <AboutCard />
                        <p className="kobo-home__interactionHint">
                          <span aria-hidden>↖</span>
                          <span className="kobo-home__desktopHint">カーソルをのせると、誰かがひょっこり。</span>
                          <span className="kobo-home__touchHint">タップすると、ごあいさつ。</span>
                        </p>
                      </>
                    ) : <MenuCard slug={slug} />}
                  </li>
                ))}
              </ul>
            </nav>
          </main>
          <footer className="kobo-home__footer">
            <span>© 2026 髙尾工房</span><span>ひとつずつ、ていねいに。<span aria-hidden> ✧</span></span>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
}
