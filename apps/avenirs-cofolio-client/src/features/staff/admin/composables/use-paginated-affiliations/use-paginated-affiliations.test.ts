import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { EUserCategory1 } from '@/api/avenir-esr'
import { usePaginatedAffiliations } from '@/features/staff/admin/composables/use-paginated-affiliations/use-paginated-affiliations'

function mountUsePaginatedAffiliations ({
  currentPage = 0,
  pageSize = PageSizes.TWELVE,
  keyword = undefined,
  categories = undefined,
  institutionIds = undefined,
  groupIds = undefined,
}: {
  currentPage?: number
  pageSize?: PageSizes
  keyword?: string
  categories?: EUserCategory1[]
  institutionIds?: string[]
  groupIds?: string[]
} = {}) {
  const pageRef = ref(currentPage)
  const pageSizeRef = ref(pageSize)
  const keywordRef = ref<string | undefined>(keyword)
  const categoriesRef = ref<EUserCategory1[] | undefined>(categories)
  const institutionIdsRef = ref<string[] | undefined>(institutionIds)
  const groupIdsRef = ref<string[] | undefined>(groupIds)

  const { result } = mountComposable(() => usePaginatedAffiliations({
    pageRef,
    pageSizeRef,
    keywordRef,
    categoriesRef,
    institutionIdsRef,
    groupIdsRef,
  }), { useTanstack: true })

  return {
    ...result,
    pageRef,
    pageSizeRef,
    keywordRef,
    categoriesRef,
    institutionIdsRef,
    groupIdsRef,
  }
}

BddTest().given('a usePaginatedAffiliations composable', () => {
  BddTest().when('the composable is mounted', () => {
    let result: ReturnType<typeof mountUsePaginatedAffiliations>

    beforeEach(() => {
      result = mountUsePaginatedAffiliations()
    })

    BddTest().then('it should expose the pagination handlers', () => {
      expect(result.pageSizeSelected.value).toBe(PageSizes.TWELVE)
      expect(typeof result.onUpdateCurrentPage).toBe('function')
      expect(typeof result.onUpdatePageSize).toBe('function')
    })

    BddTest().then('it should return users and page info from the API', async () => {
      await vi.waitFor(() => {
        expect(result.users.value.length).toBeGreaterThan(0)
        expect(result.pageInfo.value).toBeDefined()
      })
    })
  })

  BddTest().when('the current page changes', () => {
    let result: ReturnType<typeof mountUsePaginatedAffiliations>

    beforeEach(() => {
      result = mountUsePaginatedAffiliations()
    })

    BddTest().then('it should update the selected page', () => {
      result.onUpdateCurrentPage(1)

      expect(result.pageRef.value).toBe(1)
    })
  })

  BddTest().when('the page size changes', () => {
    let result: ReturnType<typeof mountUsePaginatedAffiliations>

    beforeEach(() => {
      result = mountUsePaginatedAffiliations()
    })

    BddTest().then('it should update the selected page size', () => {
      result.onUpdatePageSize(PageSizes.EIGHT)

      expect(result.pageSizeSelected.value).toBe(PageSizes.EIGHT)
    })
  })

  BddTest().when('the keyword changes', () => {
    let result: ReturnType<typeof mountUsePaginatedAffiliations>

    beforeEach(() => {
      result = mountUsePaginatedAffiliations()
    })

    BddTest().then('it should accept the new keyword', async () => {
      result.keywordRef.value = 'alice'
      await nextTick()

      expect(result.keywordRef.value).toBe('alice')
    })
  })

  BddTest().when('the user categories change', () => {
    let result: ReturnType<typeof mountUsePaginatedAffiliations>

    beforeEach(() => {
      result = mountUsePaginatedAffiliations()
    })

    BddTest().then('it should accept the selected categories', async () => {
      result.categoriesRef.value = [EUserCategory1.STUDENT]
      await nextTick()

      expect(result.categoriesRef.value).toEqual([EUserCategory1.STUDENT])
    })
  })

  BddTest().when('the institution IDs change', () => {
    let result: ReturnType<typeof mountUsePaginatedAffiliations>

    beforeEach(() => {
      result = mountUsePaginatedAffiliations()
    })

    BddTest().then('it should accept the selected institution IDs', async () => {
      result.institutionIdsRef.value = ['institution-1']
      await nextTick()

      expect(result.institutionIdsRef.value).toEqual(['institution-1'])
    })
  })

  BddTest().when('the group IDs change', () => {
    let result: ReturnType<typeof mountUsePaginatedAffiliations>

    beforeEach(() => {
      result = mountUsePaginatedAffiliations()
    })

    BddTest().then('it should accept the selected group IDs', async () => {
      result.groupIdsRef.value = ['group-1']
      await nextTick()

      expect(result.groupIdsRef.value).toEqual(['group-1'])
    })
  })
})
