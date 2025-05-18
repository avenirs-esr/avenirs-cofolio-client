export const AvAvailableLocales = ['en', 'fr'] as const satisfies readonly string[]
export type AvLocale = (typeof AvAvailableLocales)[number]
