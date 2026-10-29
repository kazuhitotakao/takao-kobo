// 「一覧へ戻る」とブラウザの戻る・進むで、復元するURLを共有する。
let restoreTarget: string | null = null;

if (typeof window !== 'undefined') {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (navigation?.type === 'reload' || navigation?.type === 'back_forward') {
    const url = new URL(navigation.name);
    restoreTarget = url.pathname + url.search;
  }
  window.addEventListener('popstate', () => {
    restoreTarget = location.pathname + location.search;
  });
}

export function requestScrollRestoration(href: string) {
  const url = new URL(href, location.href);
  restoreTarget = url.pathname + url.search;
}

export function takeScrollRestoration(url: string) {
  if (restoreTarget !== url) return false;
  restoreTarget = null;
  return true;
}
