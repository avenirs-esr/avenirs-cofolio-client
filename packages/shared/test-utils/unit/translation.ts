export function interpolateTranslation (translation: string, params: Record<string, string>): string {
  return translation.replace(/\{(\w+)\}/g, (placeholder, name: string) => params[name] ?? placeholder)
}
