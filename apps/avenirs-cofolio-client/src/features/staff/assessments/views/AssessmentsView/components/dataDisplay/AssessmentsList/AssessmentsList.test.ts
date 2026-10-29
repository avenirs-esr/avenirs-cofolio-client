import type { VueWrapper } from '@vue/test-utils'
import type { DeclaredActivityToAssessDTO } from '@/api/avenir-esr'
import type { UsePaginatedStaffAssessmentsResult } from '@/features/staff/assessments/composables/use-paginated-staff-assessments'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiException } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { EActivityAssessmentStatus, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PaginationStub } from '@/common/components/navigation/Pagination/Pagination.stub'
import { usePaginatedStaffAssessments } from '@/features/staff/assessments/composables/use-paginated-staff-assessments'
import { AssessmentOverviewListStub } from '@/features/staff/assessments/views/AssessmentsView/components/base/AssessmentOverviewList.stub'
import AssessmentsList from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.vue'
import {
  AssessmentStatusMultiselectStub
} from '@/features/staff/assessments/views/AssessmentsView/components/selects/AssessmentStatusMultiselect.stub'

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
    declaredActivityStatus: EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT,
    assessmentStatus: EActivityAssessmentStatus.OPENED,
  },
  {
    id: 'activity-to-assess-2',
    student: {
      id: 'student-2',
      firstName: 'Bob',
      lastName: 'Martin',
      email: 'bob.martin@test.fr',
    },
    activity: {
      id: 'activity-2',
      title: 'Activité 2',
    },
    submittedAt: '2024-01-16T12:00:00Z',
    declaredActivityStatus: EDeclaredActivityStatus.COMPLETED,
    assessmentStatus: EActivityAssessmentStatus.SENT,
  },
]

const mockPageInfo = {
  page: 0,
  pageSize: 12,
  totalElements: mockAssessments.length,
  totalPages: 1,
}

const mockStore = reactive({
  assessmentsCurrentPage: 0,
  assessmentsPageSizeSelected: PageSizes.TWELVE,
})

const defaultPaginatedResult = {
  assessments: computed(() => mockAssessments),
  pageInfo: computed(() => mockPageInfo),
  isFetching: ref(false),
  error: ref(null),
  pageSizeSelected: computed(() => PageSizes.TWELVE),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
} as unknown as UsePaginatedStaffAssessmentsResult

vi.mock('@/features/staff/assessments/composables/use-paginated-staff-assessments', () => ({
  usePaginatedStaffAssessments: vi.fn(),
}))

vi.mock('@/features/staff/assessments/stores/assessments.store', () => ({
  useStaffAssessmentsStore: () => mockStore,
}))

const mockUsePaginatedStaffAssessments = vi.mocked(usePaginatedStaffAssessments)

BddTest().given('an assessments list', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentsList>>

  const stubs = {
    AssessmentStatusMultiselect: AssessmentStatusMultiselectStub,
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    AssessmentOverviewList: AssessmentOverviewListStub,
  }

  const mountWith = async ({
    paginatedResult = defaultPaginatedResult,
  }: {
    paginatedResult?: UsePaginatedStaffAssessmentsResult
  } = {}) => {
    vi.clearAllMocks()

    mockUsePaginatedStaffAssessments.mockReturnValue(paginatedResult)

    wrapper = mountComponent(AssessmentsList, {
      global: { stubs },
    })

    await flushPromises()
  }

  const getMultiselect = () => wrapper.findComponent(AssessmentStatusMultiselectStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getAssessmentOverviewList = () => wrapper.findComponent(AssessmentOverviewListStub)

  beforeEach(async () => {
    mockStore.assessmentsCurrentPage = 0
    mockStore.assessmentsPageSizeSelected = PageSizes.TWELVE
    await mountWith()
  })

  BddTest().when('the component is rendered', () => {
    BddTest().then('it should render the status multiselect', () => {
      expect(getMultiselect().exists()).toBe(true)
    })

    BddTest().then('it should pass the state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBeNull()
      expect(getQuerySuspense().props('preserveContent')).toBe(true)
      expect(getQuerySuspense().props('emptyStateMessage')).toBe('Aucune évaluation')
    })

    BddTest().then('it should pass the pagination props to Pagination', () => {
      expect(getPagination().props('pageInfo')).toEqual(mockPageInfo)
      expect(getPagination().props('pageSizeSelected')).toEqual(PageSizes.TWELVE)
      expect(getPagination().props('onUpdateCurrentPage')).toBe(defaultPaginatedResult.onUpdateCurrentPage)
      expect(getPagination().props('onUpdatePageSize')).toBe(defaultPaginatedResult.onUpdatePageSize)
    })

    BddTest().then('it should map assessments to rows and pass them to AssessmentOverviewList', () => {
      expect(getAssessmentOverviewList().props('rows')).toEqual([
        {
          id: mockAssessments[0].id,
          learner: mockAssessments[0].student,
          activityTitle: mockAssessments[0].activity.title,
          type: 'default',
          submitDate: mockAssessments[0].submittedAt,
          status: mockAssessments[0].assessmentStatus,
          actions: mockAssessments[0].id,
        },
        {
          id: mockAssessments[1].id,
          learner: mockAssessments[1].student,
          activityTitle: mockAssessments[1].activity.title,
          type: 'default',
          submitDate: mockAssessments[1].submittedAt,
          status: mockAssessments[1].assessmentStatus,
          actions: mockAssessments[1].id,
        },
      ])
    })

    BddTest().then('it should pass columns configuration to AssessmentOverviewList', () => {
      expect(getAssessmentOverviewList().props('columns')).toEqual([
        { key: 'learner', label: 'Apprenant', width: '25%' },
        { key: 'activityTitle', label: 'Activité', width: '25%' },
        { key: 'type', label: 'Type', width: '20%' },
        { key: 'submitDate', label: 'Date de dépôt', width: '13%' },
        { key: 'status', label: 'Statut', width: '12%' },
        { key: 'actions', label: 'Accéder', width: '5%' },
      ])
    })
  })

  BddTest().when('the assessments list is empty', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          assessments: computed(() => []),
          pageInfo: computed(() => undefined),
        },
      })
    })

    BddTest().then('it should mark QuerySuspense as empty', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
    })

    BddTest().then('it should not render Pagination when pageInfo is undefined', () => {
      expect(getPagination().exists()).toBe(false)
    })
  })

  BddTest().when('the request is fetching', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          isFetching: ref(true),
        },
      })
    })

    BddTest().then('it should pass isLoading true to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the request returns an error', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          error: ref(mockError),
        },
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBe(mockError)
    })
  })

  BddTest().when('the status filter changes', () => {
    beforeEach(async () => {
      mockStore.assessmentsCurrentPage = 3
      getMultiselect().vm.$emit('update:modelValue', [EActivityAssessmentStatus.NEW])
      await flushPromises()
    })

    BddTest().then('it should reset assessmentsCurrentPage to 0 in store', () => {
      expect(mockStore.assessmentsCurrentPage).toBe(0)
    })
  })
})
