import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { type ProgramProgressOverviewDTO, SkillLevelStatus, type SkillOverviewDTO } from '@/api/avenir-esr'
import { useStudentCoursesSummaryQuery } from '@/features/student/queries'
import { mountWithRouter, testUseBaseApiExceptionToast } from 'tests/utils'
import StudentSkillsWidget from './StudentSkillsWidget.vue'

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
  const mockedSkills: Array<SkillOverviewDTO> = [
    {
      id: 'skill1',
      name: 'Prévenir la pollution à la source',
      traceCount: 1,
      activityCount: 8,
      currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.VALIDATED }
    },
    {
      id: 'skill2',
      name: 'Mettre en place des filières d’économies circulaires',
      traceCount: 2,
      activityCount: 7,
      currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.VALIDATED }
    },
    {
      id: 'skill3',
      name: 'Évaluer l’impact environnemental et économique',
      traceCount: 3,
      activityCount: 6,
      currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.FAILED }
    },
    {
      id: 'skill4',
      name: 'Concevoir des synthèses chimiques durables',
      traceCount: 4,
      activityCount: 5,
      currentSkillLevel: { id: 'Niv2', name: 'Niv.2', status: SkillLevelStatus.VALIDATED }
    },
    {
      id: 'skill5',
      name: 'Réaliser un circuit électrique',
      traceCount: 5,
      activityCount: 4,
      currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.VALIDATED }
    },
    {
      id: 'skill6',
      name: 'Comprendre les risques électriques liés au travail en hauteur, en milieu humide, en point chaud et appréhender la consignation',
      traceCount: 6,
      activityCount: 3,
      currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.VALIDATED }
    },
    {
      id: 'skill7',
      name: 'Réaliser une étude de marché',
      traceCount: 7,
      activityCount: 2,
      currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.FAILED }
    },
    {
      id: 'skill8',
      name: 'Réaliser un cahier des charges fonctionnels',
      traceCount: 8,
      activityCount: 1,
      currentSkillLevel: { id: 'Niv2', name: 'Niv.2', status: SkillLevelStatus.VALIDATED }
    },
  ]

  const courses = [
    { id: 'course2', name: 'Master Électronique Énergie électrique et automatique - Spécialité Ingénierie des systèmes temps réel', skills: mockedSkills },
    { id: 'course1', name: 'Master Chimie Verte et Éco-innovations', skills: mockedSkills },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentCoursesSummaryQuery(courses)
  })

  it('should display nothing if no course is available', async () => {
    mockUseStudentCoursesSummaryQuery([])
    const wrapper = await mountWithRouter(StudentSkillsWidget)
    const avCard = wrapper.findComponent({ name: 'AvCard' })
    expect(avCard.exists()).toBe(false)
  })

  it('should display 1 course and up to 6 skills if 1 course is available', async () => {
    mockUseStudentCoursesSummaryQuery(courses.slice().slice(0, 1))
    const wrapper = await mountWithRouter(StudentSkillsWidget)
    const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
    expect(studentSkillsWidgetContainers).toHaveLength(1)
    expect(studentSkillsWidgetContainers[0].props('maxSkillsDisplayed')).toBe(6)
  })

  it('should display 2 courses and up to 3 skills by course if 2 courses are available', async () => {
    const wrapper = await mountWithRouter(StudentSkillsWidget)
    const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
    expect(studentSkillsWidgetContainers).toHaveLength(2)
    studentSkillsWidgetContainers.forEach((container) => {
      expect(container.props('maxSkillsDisplayed')).toBe(3)
    })
  })

  it('should call navigation on button click', async () => {
    const wrapper = await mountWithRouter(StudentSkillsWidget)
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentSkills).toHaveBeenCalled()
  })

  testUseBaseApiExceptionToast<ProgramProgressOverviewDTO[]>({
    mockedUseQuery: mockedUseStudentCoursesSummaryQuery,
    payload: [],
    mountComponent: () => mountWithRouter(StudentSkillsWidget)
  })
})
