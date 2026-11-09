import type { Ref } from 'vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EActivityAssessmentStatus } from '@avenirs-esr/shared/api/avenir-esr'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import {
  createMockedPagedResponseDeclaredActivitiesToAssessDTO
} from '@/__mocks__/fixtures/staffs/assessments.fixtures'
import { getDeclaredActivitiesToAssessErrorHandler } from '@/__mocks__/msw/handlers/staffs/assessments.handlers'
import { server } from '@/__mocks__/msw/server'
import { usePaginatedStaffAssessments } from '@/features/staff/assessments/composables/use-paginated-staff-assessments'

function mountUsePaginatedStaffAssessments ({
  currentPage = 0,
  pageSize = PageSizes.TWELVE,
  statusesRef = ref<EActivityAssessmentStatus[] | undefined>(undefined),
}: {
  currentPage?: number
  pageSize?: PageSizes
  statusesRef?: Ref<EActivityAssessmentStatus[] | undefined>
} = {}) {
  const currentPageRef = ref(currentPage)
  const pageSizeRef = ref(pageSize)

  const { result } = mountComposable(() =>
    usePaginatedStaffAssessments({
      statusesRef,
      currentPageRef,
      pageSizeRef,
    }), { useTanstack: true })

  return {
    result,
    currentPageRef,
    pageSizeRef,
    statusesRef,
  }
}

BddTest().given('a usePaginatedStaffAssessments composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('query returns valid data', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAssessments>['result']
    const expectedPage = createMockedPagedResponseDeclaredActivitiesToAssessDTO(PageSizes.TWELVE, 0)

    beforeEach(async () => {
      result = mountUsePaginatedStaffAssessments().result
      await flushPromises()
    })

    BddTest().then('it should return assessments and pageInfo from data', () => {
      expect(result.assessments.value).toEqual(expectedPage.data)
      expect(result.pageInfo.value).toEqual(expectedPage.page)
    })

    BddTest().then('it should return isFetching as false', () => {
      expect(result.isFetching.value).toBe(false)
    })

    BddTest().then('it should return no error', () => {
      expect(result.error.value).toBeNull()
    })

    BddTest().then('it should expose pageSizeSelected, onUpdateCurrentPage and onUpdatePageSize', () => {
      expect(result.pageSizeSelected.value).toBe(PageSizes.TWELVE)
      expect(typeof result.onUpdateCurrentPage).toBe('function')
      expect(typeof result.onUpdatePageSize).toBe('function')
    })
  })

  BddTest().when('updating pagination handlers', () => {
    let mounted: ReturnType<typeof mountUsePaginatedStaffAssessments>

    beforeEach(async () => {
      mounted = mountUsePaginatedStaffAssessments({ pageSize: PageSizes.TWELVE })
      await flushPromises()
    })

    BddTest().then('it should update current page', async () => {
      mounted.result.onUpdateCurrentPage(1)
      await flushPromises()

      const expectedPage = createMockedPagedResponseDeclaredActivitiesToAssessDTO(PageSizes.TWELVE, 1)
      expect(mounted.result.pageInfo.value?.page).toBe(1)
      expect(mounted.result.assessments.value).toEqual(expectedPage.data)
    })

    BddTest().then('it should update page size', async () => {
      mounted.result.onUpdatePageSize(PageSizes.FOUR)
      await flushPromises()

      const expectedPage = createMockedPagedResponseDeclaredActivitiesToAssessDTO(PageSizes.FOUR, 0)
      expect(mounted.result.pageSizeSelected.value).toBe(PageSizes.FOUR)
      expect(mounted.result.pageInfo.value?.pageSize).toBe(PageSizes.FOUR)
      expect(mounted.result.assessments.value).toEqual(expectedPage.data)
    })
  })

  BddTest().when('statuses change', () => {
    const statusesRef = ref<EActivityAssessmentStatus[] | undefined>(undefined)
    let mounted: ReturnType<typeof mountUsePaginatedStaffAssessments>

    beforeEach(async () => {
      mounted = mountUsePaginatedStaffAssessments({ statusesRef })
      await flushPromises()
    })

    BddTest().then('it should update data with new statuses', async () => {
      statusesRef.value = [EActivityAssessmentStatus.OPENED]
      await flushPromises()

      const expectedPage = createMockedPagedResponseDeclaredActivitiesToAssessDTO(
        PageSizes.TWELVE,
        0,
        [EActivityAssessmentStatus.OPENED]
      )
      expect(mounted.result.assessments.value).toEqual(expectedPage.data)
    })
  })

  BddTest().when('query is fetching', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAssessments>['result']

    beforeEach(() => {
      result = mountUsePaginatedStaffAssessments().result
    })

    BddTest().then('it should return isFetching as true before request resolves', () => {
      expect(result.isFetching.value).toBe(true)
    })
  })

  BddTest().when('query returns an error', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAssessments>['result']

    beforeEach(async () => {
      server.use(getDeclaredActivitiesToAssessErrorHandler)
      result = mountUsePaginatedStaffAssessments().result
      await flushPromises()
    })

    BddTest().then('it should return empty assessments and undefined pageInfo', () => {
      expect(result.assessments.value).toEqual([])
      expect(result.pageInfo.value).toBeUndefined()
    })

    BddTest().then('it should return the error', () => {
      expect(result.error.value).toBeDefined()
      expect(result.error.value).not.toBeNull()
    })
  })
})
