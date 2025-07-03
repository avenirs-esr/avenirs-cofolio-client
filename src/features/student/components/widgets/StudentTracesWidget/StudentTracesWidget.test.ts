import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import StudentTracesWidget from '@/features/student/components/widgets/StudentTracesWidget/StudentTracesWidget.vue'
import { useStudentTracesSummaryQuery } from '@/features/student/queries'
import { type TraceOverviewDTO, TraceType } from '@/types'
import { mountWithRouter } from '@/ui/tests/utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { testUseBaseApiExceptionToast } from 'tests/utils'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const navigateToStudentTraces = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentTraces,
    }),
  }
})

vi.mock('@/features/student/queries', () => ({
  useStudentTracesSummaryQuery: vi.fn()
}))

const mockedUseStudentTracesSummaryQuery = vi.mocked(useStudentTracesSummaryQuery)

function mockUseStudentTracesSummaryQuery (payload: TraceOverviewDTO[]) {
  const mockData: Ref<TraceOverviewDTO[]> = ref(payload)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError,
  } as unknown as UseQueryDefinedReturnType<TraceOverviewDTO[], BaseApiException>
  mockedUseStudentTracesSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentTracesWidget', async () => {
  const traces: Array<TraceOverviewDTO> = [
    {
      id: 'trace1',
      name: 'Prévenir la pollution à la source',
      skillCount: 1,
      activityCount: 8,
      type: TraceType.GROUP,
      filedAt: '2024-05-13T08:42:17',
      course: 'Master Chimie Verte et Éco-innovations'
    },
    {
      id: 'trace2',
      name: 'Mettre en place des filières d’économies circulaires',
      skillCount: 2,
      activityCount: 7,
      type: TraceType.INDIVIDUAL,
      filedAt: '2024-11-29T19:15:03'
    },
    {
      id: 'trace3',
      name: 'Évaluer l’impact environnemental et économique',
      skillCount: 3,
      activityCount: 6,
      type: TraceType.INDIVIDUAL,
      filedAt: '2025-02-07T23:08:51',
      course: 'Master Chimie Verte et Éco-innovations'

    },
    {
      id: 'trace4',
      name: 'Concevoir des synthèses chimiques durables',
      skillCount: 4,
      activityCount: 5,
      type: TraceType.GROUP,
      filedAt: '2024-08-21T04:26:39'
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentTracesSummaryQuery(traces)
  })

  it('should display up to 3 traces', async () => {
    const wrapper = await mountWithRouter(StudentTracesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const studentTraceCards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
    expect(studentTraceCards).toHaveLength(3)
  })

  it('should call navigation on button click', async () => {
    const wrapper = await mountWithRouter(StudentTracesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentTraces).toHaveBeenCalled()
  })

  testUseBaseApiExceptionToast<TraceOverviewDTO[]>({
    mockedUseQuery: mockedUseStudentTracesSummaryQuery,
    payload: [],
    mountComponent: () => mountWithRouter(StudentTracesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })
})
