import { createPageMetadata } from '@/lib/metadata';
import type { ReactNode } from 'react';
import { CharacterIcon } from '@/components/home/character';
import { SubPage } from '@/components/sub-page';

export const metadata = createPageMetadata({
  title: 'About me',
  description: '髙尾工房について。市役所職員からWebエンジニアへの歩みや、ものづくりへの思い、釣り・家庭菜園などの趣味を紹介します。',
  path: '/about',
});

function AboutSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="border-l-4 border-sky-400 pl-3 text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-6 space-y-5 leading-loose text-slate-700 sm:text-lg">{children}</div>
    </section>
  );
}

// 手描きイラストを後から各セクションに差し込めるよう、セクション同士の間は広めにあけておく
export default function AboutPage() {
  return (
    <SubPage slug="about">
      <div className="mt-10 space-y-16 sm:mt-12 sm:space-y-20">
        <AboutSection title="髙尾工房について">
          <p className="pb-2 text-2xl leading-normal font-bold text-foreground sm:text-3xl">
            <span className="bg-linear-to-t from-sky-200 from-35% to-transparent to-35% px-1">
              一歩ずつ、つくっていく。
            </span>
          </p>
          <p>髙尾工房は、Webアプリの開発や、趣味・日々の暮らしを記録する小さな場所です。</p>
          <p>最初から完璧を目指すのではなく、学んで、試して、失敗しながら、少しずつ前に進んでいく。</p>
          <p>そんな思いを「Step by Step」という言葉に込めています。</p>
        </AboutSection>

        <AboutSection title="自己紹介">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <div className="w-24 shrink-0 text-navy sm:w-28" aria-hidden="true">
              <CharacterIcon />
            </div>
            <div className="w-full min-w-0 space-y-5">
              <p>約12年間、市役所で働いた後、Webエンジニアに転身しました。</p>
              <p>2024年2月からWeb開発の学習を始め、2025年4月からエンジニアとして実務に携わっています。</p>
              <p>これまでVue.js・Nuxt.js・Laravelを使ったWebシステムの開発・改修に携わってきました。</p>
              <p>新しいものを作ることはもちろん、既存の仕組みを改善していくことも好きです。</p>
              <p>仕事以外では、釣りや家庭菜園などを楽しんでいます。</p>
            </div>
          </div>
        </AboutSection>

        <AboutSection title="これから">
          <p>自分が作ってみたいものや、誰かの役に立つものを、一つずつ形にしていきたいと思っています。</p>
          <p>
            このサイトでは、制作したアプリや開発中に学んだこと、釣りや家庭菜園など、日々の出来事も記録していく予定です。
          </p>
          <p>小さな一歩を積み重ねながら、自分らしく成長していけたらと思っています。</p>
        </AboutSection>
      </div>
    </SubPage>
  );
}
