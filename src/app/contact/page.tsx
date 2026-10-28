import { SubPage } from '@/components/sub-page';

// 問い合わせ先のメールアドレス（空にするとメールリンクを出さない）
const contactEmail: string = 'simasyamu@gmail.com';

// Gmail のフィルタで迷惑メールに振り分けられないようにできるよう、件名は固定で入れておく
const contactSubject = '髙尾工房へのお問い合わせ';

export default function ContactPage() {
  return (
    <SubPage slug="contact">
      <section className="mt-10 rounded-2xl border border-sky-100 bg-white px-6 py-12 text-center shadow-sm sm:mt-12 sm:px-12 sm:py-16">
        <h2 className="text-xl font-bold sm:text-2xl">お問い合わせ</h2>
        <span aria-hidden className="mx-auto mt-3 block h-1 w-10 rounded-full bg-sky-300" />
        <p className="mt-8 leading-loose text-balance text-slate-700 sm:text-lg">
          お仕事のご相談や、制作したものについてのご質問など、
          <br className="hidden sm:inline" />
          お気軽にご連絡ください。
        </p>
        {contactEmail ? (
          <>
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(contactSubject)}`}
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-8 py-3 font-semibold text-sky-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              メールを送る
            </a>
            {/* メールアプリを設定していない PC ではボタンを押しても開かないので、コピーできるようアドレスも出す */}
            <p className="mt-6 text-sm leading-relaxed text-balance text-slate-500">
              メールアプリが開かない場合は、こちらへお送りください。
              <br />
              <span className="font-medium text-slate-700 select-all">{contactEmail}</span>
            </p>
          </>
        ) : (
          <p className="mt-10 text-sm text-slate-500">メールアドレスは準備中です。</p>
        )}
      </section>
    </SubPage>
  );
}
