export { hasStringField } from '@avenirs-esr/shared'

export function isEnumMember<T extends Record<string, string>> (enumObject: T, value: string): value is T[keyof T] {
  return Object.values(enumObject).includes(value)
}
