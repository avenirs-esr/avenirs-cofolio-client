import type { ProgramProgressOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { mockedProgramsProgressOverview } from '@/__mocks__/fixtures/student'
import StudentSkillsWidget from '@/features/student/components/widgets/StudentSkillsWidget/StudentSkillsWidget.vue'
import { useStudentCoursesSummaryQuery } from '@/features/student/queries'
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

const navigateToStudentSkills = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentSkills,
    }),
  }
})

vi.mock('@/features/student/queries', () => ({
  useStudentCoursesSummaryQuery: vi.fn()
}))

const mockedUseStudentCoursesSummaryQuery = vi.mocked(useStudentCoursesSummaryQuery)

function mockUseStudentCoursesSummaryQuery (payload: ProgramProgressOverviewDTO[]) {
  const mockData: Ref<ProgramProgressOverviewDTO[]> = ref(payload)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<ProgramProgressOverviewDTO[], BaseApiException>
  mockedUseStudentCoursesSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentSkillsWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentCoursesSummaryQuery(mockedProgramsProgressOverview)
  })

  it('should display nothing if no course is available', async () => {
    mockUseStudentCoursesSummaryQuery([])
    const wrapper = await mountWithRouter(StudentSkillsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const avCard = wrapper.findComponent({ name: 'AvCard' })
    expect(avCard.exists()).toBe(false)
  })

  it('should display 1 course and up to 6 skills if 1 course is available', async () => {
    mockUseStudentCoursesSummaryQuery(mockedProgramsProgressOverview.slice().slice(0, 1))
    const wrapper = await mountWithRouter(StudentSkillsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
    expect(studentSkillsWidgetContainers).toHaveLength(1)
    expect(studentSkillsWidgetContainers[0].props('maxSkillsDisplayed')).toBe(6)
  })

  it('should display 2 courses and up to 3 skills by course if 2 courses are available', async () => {
    const wrapper = await mountWithRouter(StudentSkillsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
    expect(studentSkillsWidgetContainers).toHaveLength(2)
    studentSkillsWidgetContainers.forEach((container) => {
      expect(container.props('maxSkillsDisplayed')).toBe(3)
    })
  })

  it('should call navigation on button click', async () => {
    const wrapper = await mountWithRouter(StudentSkillsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentSkills).toHaveBeenCalled()
  })

  testUseBaseApiExceptionToast<ProgramProgressOverviewDTO[]>({
    mockedUseQuery: mockedUseStudentCoursesSummaryQuery,
    payload: [],
    mountComponent: () => mountWithRouter(StudentSkillsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })
})
