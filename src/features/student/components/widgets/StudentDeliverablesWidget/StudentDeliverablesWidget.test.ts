import type { BaseApiException } from '@/common/exceptions'
import type { DeliverableOverviewDTO } from '@/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getCalendarDate, getLocalizedAbbrMonth } from '@/common/utils'
import StudentDeliverablesWidget from '@/features/student/components/widgets/StudentDeliverablesWidget/StudentDeliverablesWidget.vue'
import { useStudentDeliverablesSummaryQuery } from '@/features/student/queries'
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

const navigateToStudentDeliverables = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentDeliverables,
    }),
  }
})

vi.mock('@/features/student/queries', () => ({
  useStudentDeliverablesSummaryQuery: vi.fn()
}))

const mockedUseStudentDeliverablesSummaryQuery = vi.mocked(useStudentDeliverablesSummaryQuery)

function mockUseStudentDeliverablesSummaryQuery (payload: DeliverableOverviewDTO[]) {
  const mockData: Ref<DeliverableOverviewDTO[]> = ref(payload)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<DeliverableOverviewDTO[], BaseApiException>
  mockedUseStudentDeliverablesSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentDeliverablesWidget', () => {
  const deliverables = [
    {
      id: 'deliverable1',
      skill: 'Prévenir la pollution à la source',
      activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
      deliverableUntil: '2025-04-13T08:42:17',
    },
    {
      id: 'deliverable2',
      skill: 'Mettre en place des filières d’économies circulaires',
      activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
      deliverableUntil: '2125-06-29T19:15:03'
    },
    {
      id: 'deliverable3',
      skill: 'Évaluer l’impact environnemental et économique',
      activity: 'SAE 1.1 Séquence 4 - Un nom de séquence méga long pour tester les ellipses validation des recommandations et élaboration d’un plan d’action',
      deliverableUntil: '2125-07-07T23:08:51',

    },
    {
      id: 'deliverable4',
      skill: 'Concevoir des synthèses chimiques durables',
      activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
      deliverableUntil: '2125-08-21T04:26:39'
    },
    {
      id: 'deliverable5',
      skill: 'Conception de 2225',
      activity: 'SAE 1.1 Séquence 2225 - Validation des recommandations et élaboration d’un plan d’action',
      deliverableUntil: '2225-08-21T04:26:39'
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentDeliverablesSummaryQuery(deliverables)
  })

  it('should only display up to 3 future deliverables sorted by date', async () => {
    const wrapper = await mountWithRouter(StudentDeliverablesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const richButtons = wrapper.findAll('.av-rich-button')

    expect(richButtons).toHaveLength(3)
    expect(richButtons[0].text()).toContain(getCalendarDate(deliverables[1].deliverableUntil))
    expect(richButtons[0].text()).toContain(getLocalizedAbbrMonth(deliverables[1].deliverableUntil, 'fr').toUpperCase())
    expect(richButtons[0].text()).toContain(deliverables[1].skill)
    expect(richButtons[0].text()).toContain(deliverables[1].activity)
    expect(richButtons[1].text()).toContain(getCalendarDate(deliverables[2].deliverableUntil))
    expect(richButtons[1].text()).toContain(getLocalizedAbbrMonth(deliverables[2].deliverableUntil, 'fr').toUpperCase())
    expect(richButtons[1].text()).toContain(deliverables[2].skill)
    expect(richButtons[1].text()).toContain(deliverables[2].activity)
    expect(richButtons[2].text()).toContain(getCalendarDate(deliverables[3].deliverableUntil))
    expect(richButtons[2].text()).toContain(getLocalizedAbbrMonth(deliverables[3].deliverableUntil, 'fr').toUpperCase())
    expect(richButtons[2].text()).toContain(deliverables[3].skill)
    expect(richButtons[2].text()).toContain(deliverables[3].activity)
  })

  it('should call navigation on button click', async () => {
    const wrapper = await mountWithRouter(StudentDeliverablesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentDeliverables).toHaveBeenCalled()
  })

  testUseBaseApiExceptionToast<DeliverableOverviewDTO[]>({
    mockedUseQuery: mockedUseStudentDeliverablesSummaryQuery,
    payload: [],
    mountComponent: () => mountWithRouter(StudentDeliverablesWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })
})
