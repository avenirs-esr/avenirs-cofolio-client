import type { SortDirection } from '@/common/types'

export function formatSortParam<T extends string | number | symbol> (
  field: T,
  direction: SortDirection
): string {
  return `${String(field)},${direction}`
}
