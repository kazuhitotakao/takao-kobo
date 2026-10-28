export const menuSlugs = ['about', 'works', 'blog', 'contact'] as const;

export type MenuSlug = (typeof menuSlugs)[number];

export const menuNames: Record<MenuSlug, string> = {
  about: 'About me',
  works: 'Works',
  blog: 'Blog',
  contact: 'Contact',
};
