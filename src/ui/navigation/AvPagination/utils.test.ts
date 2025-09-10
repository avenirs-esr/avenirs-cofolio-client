import { getPaginationPages } from '@/ui/navigation/AvPagination/utils'
import { BddTest } from 'tests/utils'
import { expect } from 'vitest'

BddTest().given('a (reactive) pagination pages getter', () => {
  BddTest().when('totalPages changes', () => {
    BddTest().then('it should return correct pagination pages and update', async () => {
      const totalPages = ref(2)

      const result = getPaginationPages(totalPages)

      expect(result).toEqual([
        { title: '1', label: '1', href: '#page-1' },
        { title: '2', label: '2', href: '#page-2' },
      ])
    })
  })
})
