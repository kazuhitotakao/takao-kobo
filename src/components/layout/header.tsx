import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { menuNames, menuSlugs } from '@/lib/menu';

const focusRingClassName =
  'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

// 各ページの h1 と重ならないよう、工房名は見出しにせずリンクだけにする
export function Header() {
  return (
    <header className="border-b border-sky-200">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4">
        <Link
          href="/"
          transitionTypes={['nav-back']}
          className={`inline-block py-1 text-2xl font-bold transition-colors hover:text-sky-700 ${focusRingClassName}`}
        >
          髙尾工房
        </Link>
        <nav aria-label="メインメニュー">
          <ul className="flex flex-wrap gap-x-5 text-sm font-medium text-slate-600">
            {menuSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  transitionTypes={['nav-forward']}
                  className={`inline-block py-1 transition-colors hover:text-sky-700 ${focusRingClassName}`}
                >
                  {menuNames[slug]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
