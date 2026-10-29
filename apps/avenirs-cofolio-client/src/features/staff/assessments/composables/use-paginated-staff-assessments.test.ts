import type { Ref } from 'vue'
import type { DeclaredActivityToAssessDTO, PagedResponseDeclaredActivityToAssessDTO } from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiException } from '@avenirs-esr/shared'
import { keepPreviousData } from '@tanstack/vue-query'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick, unref } from 'vue'
import {
  EActivityAssessmentStatus,
  EDeclaredActivityStatus,
  useGetDeclaredActivitiesToAssess
} from '@/api/avenir-esr'
import { usePaginatedStaffAssessments } from '@/features/staff/assessments/composables/use-paginated-staff-assessments'

const mockError = new BaseApiException('error')

const mockAssessments: DeclaredActivityToAssessDTO[] = [
  {
    id: 'activity-to-assess-1',
    student: {
      id: 'student-1',
      firstName: 'Alice',
      lastName: 'Dupont',
      email: 'alice.dupont@test.fr',
    },
    activity: {
      id: 'activity-1',
      title: 'Activité 1',
    },
    submittedAt: '2024-01-15T12:00:00Z',
    declaredActivityStatus: EDeclaredActivityStatus.COMPLETED,
    assessmentStatus: EActivityAssessmentStatus.NEW,
  },
]

const mockPagedResponse: PagedResponseDeclaredActivityToAssessDTO = {
  data: mockAssessments,
  page: {
    page: 0,
    pageSize: 12,
    totalElements: 1,
    totalPages: 1,
  },
}

vi.mock('@/api/avenir-esr', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/avenir-esr')>()
  return {
    ...actual,
    useGetDeclaredActivitiesToAssess: vi.fn(),
  }
})

const mockUseGetDeclaredActivitiesToAssess = vi.mocked(useGetDeclaredActivitiesToAssess)

function setupMockQuery (overrides?: {
  data?: Ref<PagedResponseDeclaredActivityToAssessDTO | undefined>
  error?: Ref<BaseApiException | null>
  isFetching?: Ref<boolean>
}) {
  mockUseGetDeclaredActivitiesToAssess.mockImplementation(() => ({
    data: overrides?.data ?? ref(mockPagedResponse),
    error: overrides?.error ?? ref(null),
    isFetching: overrides?.isFetching ?? ref(false),
  } as unknown as ReturnType<typeof useGetDeclaredActivitiesToAssess>))
}

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
    }), {})

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
    setupMockQuery()
  })

  BddTest().when('query returns valid data', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAssessments>['result']

    beforeEach(() => {
      result = mountUsePaginatedStaffAssessments().result
    })

    BddTest().then('it should return assessments and pageInfo from data', () => {
      expect(result.assessments.value).toEqual(mockPagedResponse.data)
      expect(result.pageInfo.value).toEqual(mockPagedResponse.page)
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

  BddTest().when('useGetDeclaredActivitiesToAssess is called', () => {
    beforeEach(() => {
      mountUsePaginatedStaffAssessments({
        currentPage: 0,
        pageSize: PageSizes.FOUR,
        statusesRef: ref([EActivityAssessmentStatus.NEW]),
      })
    })

    BddTest().then('it should call with the correct params and query options', () => {
      expect(mockUseGetDeclaredActivitiesToAssess).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          query: expect.objectContaining({
            placeholderData: keepPreviousData,
          }),
        }),
      )

      const [paramsArg] = mockUseGetDeclaredActivitiesToAssess.mock.calls[0]
      expect(unref(paramsArg)).toEqual({
        statuses: [EActivityAssessmentStatus.NEW],
        page: 0,
        pageSize: PageSizes.FOUR,
      })
    })
  })

  BddTest().when('updating pagination handlers', () => {
    let mounted: ReturnType<typeof mountUsePaginatedStaffAssessments>

    beforeEach(() => {
      mounted = mountUsePaginatedStaffAssessments()
    })

    BddTest().then('it should update current page', async () => {
      mounted.result.onUpdateCurrentPage(2)
      await nextTick()

      expect(mockUseGetDeclaredActivitiesToAssess).toHaveBeenCalled()

      const [paramsArg] = mockUseGetDeclaredActivitiesToAssess.mock.calls[0]
      const params = typeof paramsArg === 'function' ? paramsArg() : unref(paramsArg)

      expect(params?.page).toBe(2)
    })

    BddTest().then('it should update page size', async () => {
      mounted.result.onUpdatePageSize(PageSizes.FOUR)
      await nextTick()

      expect(mockUseGetDeclaredActivitiesToAssess).toHaveBeenCalled()

      const [paramsArg] = mockUseGetDeclaredActivitiesToAssess.mock.calls[0]
      const params = typeof paramsArg === 'function' ? paramsArg() : unref(paramsArg)
      expect(params?.pageSize).toBe(PageSizes.FOUR)
    })
  })

  BddTest().when('statuses change', () => {
    const statusesRef = ref<EActivityAssessmentStatus[] | undefined>(undefined)

    beforeEach(() => {
      mountUsePaginatedStaffAssessments({ statusesRef })
    })

    BddTest().then('it should update params with new statuses', async () => {
      statusesRef.value = [EActivityAssessmentStatus.OPENED]
      await nextTick()

      expect(mockUseGetDeclaredActivitiesToAssess).toHaveBeenCalled()

      const [paramsArg] = mockUseGetDeclaredActivitiesToAssess.mock.calls[0]
      const params = typeof paramsArg === 'function' ? paramsArg() : unref(paramsArg)

      expect(params?.statuses).toEqual([EActivityAssessmentStatus.OPENED])
    })
  })

  BddTest().when('query returns isFetching as true', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAssessments>['result']

    beforeEach(() => {
      setupMockQuery({ isFetching: ref(true) })
      result = mountUsePaginatedStaffAssessments().result
    })

    BddTest().then('it should return isFetching as true', () => {
      expect(result.isFetching.value).toBe(true)
    })
  })

  BddTest().when('query returns undefined data and an error', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAssessments>['result']

    beforeEach(() => {
      setupMockQuery({
        data: ref(undefined),
        error: ref(mockError),
      })
      result = mountUsePaginatedStaffAssessments().result
    })

    BddTest().then('it should return empty assessments and undefined pageInfo', () => {
      expect(result.assessments.value).toEqual([])
      expect(result.pageInfo.value).toBeUndefined()
    })

    BddTest().then('it should return the error', () => {
      expect(result.error.value).toBe(mockError)
    })
  })
})
