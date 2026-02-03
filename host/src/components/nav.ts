import { locales, type Locale } from './locales.ts';

/** 导航链接，供 Header / Footer 使用；href 为默认语言路径，其他语言加 pathPrefix */
export const navLinks = [
  { href: '/', labelEn: 'Home', labelJa: 'ホーム' },
  { href: '/how-it-works/', labelEn: 'How it works', labelJa: '使い方' },
  { href: '/faq/', labelEn: 'FAQ', labelJa: 'よくある質問' },
  { href: '/install/', labelEn: 'Install', labelJa: 'インストール' },
  { href: '/privacy/', labelEn: 'Privacy', labelJa: 'プライバシー' },
] as const;

export type { Locale };

export function getNavHref(href: string, lang: Locale): string {
  const item = locales.find((l) => l.code === lang);
  if (!item?.pathPrefix) return href;
  return href === '/' ? `${item.pathPrefix}/` : `${item.pathPrefix}${href}`;
}

export function getNavLabel(
  item: (typeof navLinks)[number],
  lang: Locale
): string {
  return lang === 'ja' ? item.labelJa : item.labelEn;
}
