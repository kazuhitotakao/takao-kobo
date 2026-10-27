export default function HomePage() {
  return (
    <main className="min-h-screen bg-amber-50 px-6 py-16 text-stone-800">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">髙尾工房</h1>
        <p className="mt-4">つくること、暮らすことを記録する小さな工房。</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {['About me', 'Works', 'Blog', 'Contact'].map((menuName) => (
            <li key={menuName} className="rounded-xl bg-white p-6 shadow-sm">
              {menuName}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
