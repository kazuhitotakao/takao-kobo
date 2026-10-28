import { SubPage } from '@/components/sub-page';
import { getBlogArticles } from '@/lib/blog';

export default async function BlogPage() {
  const blogArticles = await getBlogArticles();

  return (
    <SubPage slug="blog">
      <ul className="mt-8 space-y-6">
        {blogArticles.map((article) => (
          <li key={article.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="mt-2 text-slate-600">{article.summary ?? '記事の詳細は準備中です。'}</p>
          </li>
        ))}
      </ul>
    </SubPage>
  );
}
