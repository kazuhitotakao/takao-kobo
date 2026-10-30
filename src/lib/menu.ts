export const menuSlugs = ['about', 'works', 'blog', 'contact'] as const;

export type MenuSlug = (typeof menuSlugs)[number];

export const menuNames: Record<MenuSlug, string> = {
  about: 'About me',
  works: 'Works',
  blog: 'Blog',
  contact: 'Contact',
};

// トップのカードと下層ページの見出しで、英語のメニュー名に添える日本語
export const menuCaptions: Record<MenuSlug, string> = {
  about: '私について',
  works: 'Webアプリ・制作物',
  blog: '日々の記録',
  contact: 'お問い合わせ',
};
