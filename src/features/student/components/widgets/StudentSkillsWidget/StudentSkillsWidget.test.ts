import type { StudentProgressOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { VueWrapper } from '@vue/test-utils'
import type { Ref } from 'vue'
import { mockedProgramsProgressOverview } from '@/__mocks__/fixtures/student'
import StudentSkillsWidget from '@/features/student/components/widgets/StudentSkillsWidget/StudentSkillsWidget.vue'
import { useStudentCoursesSummaryQuery } from '@/features/student/queries'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountWithRouter, testUseBaseApiExceptionToast } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

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

function mockUseStudentCoursesSummaryQuery (payload: StudentProgressOverviewDTO[]) {
  const mockData: Ref<StudentProgressOverviewDTO[]> = ref(payload)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<StudentProgressOverviewDTO[], BaseApiException>
  mockedUseStudentCoursesSummaryQuery.mockReturnValue(queryMockedData)
}

BddTest().given('a student skills widget', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentCoursesSummaryQuery(mockedProgramsProgressOverview)
  })

  BddTest().when('no course is available', () => {
    beforeEach(async () => {
      mockUseStudentCoursesSummaryQuery([])
      wrapper = await mountWithRouter(StudentSkillsWidget, {
        global: {
          plugins: [createPinia()],
        },
      })
    })

    BddTest().then('it should display nothing', () => {
      const avCard = wrapper.findComponent({ name: 'AvCard' })
      expect(avCard.exists()).toBe(false)
    })
  })

  BddTest().when('1 course is available', () => {
    beforeEach(async () => {
      mockUseStudentCoursesSummaryQuery(mockedProgramsProgressOverview.slice().slice(0, 1))
      wrapper = await mountWithRouter(StudentSkillsWidget, {
        global: {
          plugins: [createPinia()],
        },
      })
    })

    BddTest().then('it should display 1 course and up to 6 skills', () => {
      const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
      expect(studentSkillsWidgetContainers).toHaveLength(1)
      expect(studentSkillsWidgetContainers[0].props('maxSkillsDisplayed')).toBe(6)
    })
  })

  BddTest().when('2 course are available', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(StudentSkillsWidget, {
        global: {
          plugins: [createPinia()],
        },
      })
    })

    BddTest().then('it should display 2 courses and up to 3 skills by course', () => {
      const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
      expect(studentSkillsWidgetContainers).toHaveLength(2)
      studentSkillsWidgetContainers.forEach((container) => {
        expect(container.props('maxSkillsDisplayed')).toBe(3)
      })
    })
  })

  BddTest().when('clicking on navigation button', () => {
    BddTest().then('it should call navigation', async () => {
      const btn = wrapper.findComponent({ name: 'AvButton' })
      await btn.trigger('click')

      expect(navigateToStudentSkills).toHaveBeenCalled()
    })
  })

  testUseBaseApiExceptionToast<StudentProgressOverviewDTO[]>({
    mockedUseQuery: mockedUseStudentCoursesSummaryQuery,
    payload: [],
    mountComponent: () => mountWithRouter(StudentSkillsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })
})
