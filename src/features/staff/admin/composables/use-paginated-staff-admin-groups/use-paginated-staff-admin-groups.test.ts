import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { expect } from 'vitest'
import { nextTick } from 'vue'
import { EGroupType } from '@/api/avenir-esr'
import { usePaginatedStaffAdminGroups } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'

function mountUsePaginatedStaffAdminGroups ({
  currentPage = 0,
  pageSize = PageSizes.TWELVE,
  keyword = undefined,
  types = undefined,
}: {
  currentPage?: number
  pageSize?: PageSizes
  keyword?: string
  types?: EGroupType[]
} = {}) {
  const currentPageRef = ref(currentPage)
  const pageSizeRef = ref(pageSize)
  const keywordRef = ref<string | undefined>(keyword)
  const typesRef = ref<EGroupType[] | undefined>(types)

  const { result } = mountComposable(() => usePaginatedStaffAdminGroups({
    currentPageRef,
    pageSizeRef,
    keywordRef,
    typesRef,
  }), { useTanstack: true })

  return {
    ...result,
    currentPageRef,
    pageSizeRef,
    keywordRef,
    typesRef,
  }
}

BddTest().given('a usePaginatedStaffAdminGroups composable', () => {
  BddTest().when('the composable is mounted', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAdminGroups>

    beforeEach(() => {
      result = mountUsePaginatedStaffAdminGroups()
    })

    BddTest().then('it should expose the pagination handlers', () => {
      expect(result.pageSizeSelected.value).toBe(PageSizes.TWELVE)
      expect(typeof result.onUpdateCurrentPage).toBe('function')
      expect(typeof result.onUpdatePageSize).toBe('function')
    })

    BddTest().then('it should return the groups and page info from the API', async () => {
      await vi.waitFor(() => {
        expect(result.groups.value.length).toBeGreaterThan(0)
        expect(result.pageInfo.value).toBeDefined()
      })
    })
  })

  BddTest().when('the current page changes', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAdminGroups>

    beforeEach(() => {
      result = mountUsePaginatedStaffAdminGroups()
    })

    BddTest().then('it should update the selected page', () => {
      result.onUpdateCurrentPage(1)

      expect(result.currentPageRef.value).toBe(1)
    })
  })

  BddTest().when('the page size changes', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAdminGroups>

    beforeEach(() => {
      result = mountUsePaginatedStaffAdminGroups()
    })

    BddTest().then('it should update the selected page size', () => {
      result.onUpdatePageSize(PageSizes.EIGHT)

      expect(result.pageSizeSelected.value).toBe(PageSizes.EIGHT)
    })
  })

  BddTest().when('the group types change', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAdminGroups>

    beforeEach(() => {
      result = mountUsePaginatedStaffAdminGroups()
    })

    BddTest().then('it should accept the selected group types', async () => {
      result.typesRef.value = [EGroupType.PROGRAM]
      await nextTick()

      expect(result.typesRef.value).toEqual([EGroupType.PROGRAM])
    })
  })
})
