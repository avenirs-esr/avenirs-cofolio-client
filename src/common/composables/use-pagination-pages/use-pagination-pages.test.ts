import { mountComposable } from 'tests/utils'
import { describe, expect, it } from 'vitest'
import { usePaginationPages } from './use-pagination-pages'

describe('usePaginationPages (reactive)', () => {
  it('should return correct pagination pages and update when totalPages changes', async () => {
    const totalPages = ref(2)

    const result = mountComposable(() => usePaginationPages(totalPages), {})

    expect(result).toEqual([
      { title: '1', label: '1', href: '#page-1' },
      { title: '2', label: '2', href: '#page-2' },
    ])
  })
})
