/**
 * 支持的语言列表；新增语言时在此添加一项即可。
 * code: 与 content/ 下目录名、Locale 类型一致
 * label: 语言切换菜单中显示的名称
 * pathPrefix: 该语言站点路径前缀，默认语言为空字符串
 */
export const locales = [
  { code: 'en' as const, label: 'EN', pathPrefix: '' },
  { code: 'ja' as const, label: '日本語', pathPrefix: '/ja' },
] as const;

export type Locale = (typeof locales)[number]['code'];

export function getLocaleHomePath(locale: Locale): string {
  const item = locales.find((l) => l.code === locale);
  return item ? (item.pathPrefix ? `${item.pathPrefix}/` : '/') : '/';
}

export function getLocaleByCode(code: string): (typeof locales)[number] | undefined {
  return locales.find((l) => l.code === code);
}
