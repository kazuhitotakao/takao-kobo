import { AboutCard } from '@/components/home/about-card';
import { HomeHeader } from '@/components/home/home-header';
import { MenuCard } from '@/components/home/menu-card';
import { Container } from '@/components/layout/container';
import { PageTransition } from '@/components/page-transition';
import { menuSlugs } from '@/lib/menu';

// 下層ページは水色の背景だが、トップは白地に紺の線で描く。
// About me の人物がカードの右へはみ出すので、画面の外に出た分で横スクロールが出ないよう切っておく
export default function HomePage() {
  return (
    <PageTransition>
      <div className="flex-1 overflow-x-clip bg-white">
        <HomeHeader />
        <main className="py-12 sm:py-16">
          <Container>
            <p className="text-2xl leading-normal font-bold sm:text-3xl">
              <span className="bg-linear-to-t from-sky-200 from-35% to-transparent to-35% px-1">
                一歩ずつ、つくっていく。
              </span>
            </p>
            <p className="mt-4 leading-loose text-balance text-slate-600 sm:text-lg">
              つくること、暮らすことを記録する小さな工房です。
            </p>
            <nav aria-label="メインメニュー" className="mt-12 sm:mt-14">
              {/* About me の人物が出る場所として、スマホはカードの右を、PC は列の間をあける（globals.css の --leave-x より広く） */}
              <ul className="grid gap-6 pr-16 sm:grid-cols-2 sm:gap-x-24 sm:gap-y-10 sm:pr-0">
                {menuSlugs.map((slug) => (
                  <li key={slug}>{slug === 'about' ? <AboutCard /> : <MenuCard slug={slug} />}</li>
                ))}
              </ul>
            </nav>
          </Container>
        </main>
      </div>
    </PageTransition>
  );
}
