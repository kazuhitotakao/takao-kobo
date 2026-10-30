import { createPageMetadata } from '@/lib/metadata';
import type { ReactNode } from 'react';
import { SubPage } from '@/components/sub-page';
import { WorkCard } from '@/components/work-card';
import { getWorks } from '@/lib/works';

export const metadata = createPageMetadata({
  title: 'Works',
  description: '個人開発のアプリや学習で制作した作品を紹介します。一歩ずつ学びながら、つくってきたものをまとめています。',
  path: '/works',
});

function WorksSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-14 first:pt-0 last:pb-0 sm:py-16">
      <h2 className="border-l-4 border-sky-400 pl-3 text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function WorksPage() {
  const works = await getWorks();
  const personalWorks = works.filter((work) => work.category.includes('個人開発'));
  const learningWorks = works.filter((work) => work.category.includes('学習課題'));

  return (
    <SubPage slug="works">
      <p className="mt-6 leading-loose text-slate-700 sm:text-lg">
        一歩ずつ学びながら、制作してきたアプリや作品を紹介しています。
      </p>

      {/* 手描きイラストを後から差し込めるよう、セクション同士の間は広めにあけておく */}
      {personalWorks.length > 0 || learningWorks.length > 0 ? (
        <div className="mt-12 divide-y divide-sky-300 sm:mt-14">
          {personalWorks.length > 0 && (
            <WorksSection title="個人開発">
              <ul className="space-y-10">
                {personalWorks.map((work, index) => (
                  <li key={work.id}>
                    <WorkCard
                      work={work}
                      variant="featured"
                      detailHref={`/works/${work.id}`}
                      aboveTheFold={index === 0}
                    />
                  </li>
                ))}
              </ul>
            </WorksSection>
          )}
          {learningWorks.length > 0 && (
            <WorksSection title="学習課題">
              <ul className="grid gap-6 sm:grid-cols-2">
                {learningWorks.map((work) => (
                  <li key={work.id}>
                    <WorkCard work={work} variant="compact" detailHref={`/works/${work.id}`} />
                  </li>
                ))}
              </ul>
            </WorksSection>
          )}
        </div>
      ) : (
        <p className="mt-12 text-slate-600">作品は準備中です。</p>
      )}
    </SubPage>
  );
}
