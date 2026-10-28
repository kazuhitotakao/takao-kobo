import Link from 'next/link';
import { HeroIllustration } from '@/components/hero-illustration';
import { Container } from '@/components/layout/container';
import { MenuTitle, PageTransition } from '@/components/page-transition';
import { menuNames, menuSlugs } from '@/lib/menu';

export default function HomePage() {
  return (
    <PageTransition>
      <main className="py-12 sm:py-20">
        <Container>
          <section className="flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-sky-700">Step by Step</p>
              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">髙尾工房</h1>
              <p className="mt-5 text-xl font-medium sm:text-2xl">一歩ずつ、つくっていく。</p>
            </div>
            <HeroIllustration className="w-44 shrink-0 sm:w-60" />
          </section>
          <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2">
            {menuSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  transitionTypes={['nav-forward']}
                  className="group flex items-center justify-between rounded-xl border border-sky-100 bg-white p-5 text-lg font-semibold shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6"
                >
                  <MenuTitle slug={slug}>{menuNames[slug]}</MenuTitle>
                  <span
                    aria-hidden
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </PageTransition>
  );
}
