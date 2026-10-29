// 一覧カードのリンク内でも使える、カテゴリの表示ラベル。
export function BlogCategories({ categories }: { categories?: string[] }) {
  if (!categories?.length) return null;

  return (
    <ul aria-label="カテゴリ" className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <li key={category} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs leading-normal font-semibold text-sky-800 shadow-sm sm:text-sm">
          {category}
        </li>
      ))}
    </ul>
  );
}
