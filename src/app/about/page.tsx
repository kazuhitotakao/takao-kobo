import type { ReactNode } from 'react';
import { SubPage } from '@/components/sub-page';

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

        <AboutSection title="自分について">
          <p>約12年間、市役所で働いた後、Webエンジニアに転身しました。</p>
          <p>これまでNuxt・VueやLaravelを使ったWebシステムの開発・改修に携わってきました。</p>
          <p>新しいものを作ることはもちろん、既存の仕組みを改善していくことも好きです。</p>
          <p>仕事以外では、釣りや家庭菜園などを楽しんでいます。</p>
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
