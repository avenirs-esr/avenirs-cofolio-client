import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { useStudentCoursesSummaryQuery } from '@/features/student/queries'
import { type CourseDTO, LevelStatus, type SkillDTO } from '@/types'
import { mount } from '@vue/test-utils'
import StudentSkillsWidget from './StudentSkillsWidget.vue'

const navigateToStudentSkills = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentSkills,
  }),
}))

vi.mock('@/features/student/queries', () => ({
  useStudentCoursesSummaryQuery: vi.fn()
}))

const mockedUseStudentCoursesSummaryQuery = vi.mocked(useStudentCoursesSummaryQuery)

function mockUseStudentCoursesSummaryQuery (payload: CourseDTO[]) {
  const mockData: Ref<CourseDTO[]> = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as UseQueryDefinedReturnType<CourseDTO[], BaseApiException>
  mockedUseStudentCoursesSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentSkillsWidget', () => {
  const mockedSkills: Array<SkillDTO> = [
    {
      id: 'skill1',
      name: 'Prévenir la pollution à la source',
      trackCount: 1,
      activityCount: 8,
      levels: [
        { id: 'Niv1', name: 'Niv.1', status: LevelStatus.VALIDATED },
        { id: 'Niv2', name: 'Niv.2', status: LevelStatus.TO_EVALUATE }
      ]
    },
    {
      id: 'skill2',
      name: 'Mettre en place des filières d’économies circulaires',
      trackCount: 2,
      activityCount: 7,
      levels: [
        { id: 'Niv1', name: 'Niv.1', status: LevelStatus.VALIDATED },
        { id: 'Niv2', name: 'Niv.2', status: LevelStatus.TO_EVALUATE }
      ]
    },
    {
      id: 'skill3',
      name: 'Évaluer l’impact environnemental et économique',
      trackCount: 3,
      activityCount: 6,
      levels: [
        { id: 'Niv1', name: 'Niv.1', status: LevelStatus.NOT_VALIDATED },
        { id: 'Niv2', name: 'Niv.2', status: LevelStatus.UNDER_REVIEW }
      ]
    },
    {
      id: 'skill4',
      name: 'Concevoir des synthèses chimiques durables',
      trackCount: 4,
      activityCount: 5,
      levels: [{ id: 'Niv2', name: 'Niv.2', status: LevelStatus.VALIDATED }]
    },
    {
      id: 'skill5',
      name: 'Réaliser un circuit électrique',
      trackCount: 5,
      activityCount: 4,
      levels: [
        { id: 'Niv1', name: 'Niv.1', status: LevelStatus.VALIDATED },
        { id: 'Niv2', name: 'Niv.2', status: LevelStatus.TO_EVALUATE }
      ]
    },
    {
      id: 'skill6',
      name: 'Comprendre les risques électriques liés au travail en hauteur, en milieu humide, en point chaud et appréhender la consignation',
      trackCount: 6,
      activityCount: 3,
      levels: [
        { id: 'Niv1', name: 'Niv.1', status: LevelStatus.VALIDATED },
        { id: 'Niv2', name: 'Niv.2', status: LevelStatus.TO_EVALUATE }
      ]
    },
    {
      id: 'skill7',
      name: 'Réaliser une étude de marché',
      trackCount: 7,
      activityCount: 2,
      levels: [
        { id: 'Niv1', name: 'Niv.1', status: LevelStatus.NOT_VALIDATED },
        { id: 'Niv2', name: 'Niv.2', status: LevelStatus.UNDER_REVIEW }
      ]
    },
    {
      id: 'skill8',
      name: 'Réaliser un cahier des charges fonctionnels',
      trackCount: 8,
      activityCount: 1,
      levels: [{ id: 'Niv2', name: 'Niv.2', status: LevelStatus.VALIDATED }]
    },
  ]

  const courses = [
    { id: 'course2', name: 'Master Électronique Énergie électrique et automatique - Spécialité Ingénierie des systèmes temps réel', skills: mockedSkills },
    { id: 'course1', name: 'Master Chimie Verte et Éco-innovations', skills: mockedSkills },
  ]

  beforeEach(() => {
    mockUseStudentCoursesSummaryQuery(courses)
  })

  it('should display nothing if no course is available', () => {
    mockUseStudentCoursesSummaryQuery([])
    const wrapper = mount(StudentSkillsWidget)
    const avCard = wrapper.findComponent({ name: 'AvCard' })
    expect(avCard.exists()).toBe(false)
  })

  it('should display 1 course and up to 6 skills if 1 course is available', () => {
    mockUseStudentCoursesSummaryQuery(courses.slice().slice(0, 1))
    const wrapper = mount(StudentSkillsWidget)
    const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
    expect(studentSkillsWidgetContainers).toHaveLength(1)
    expect(studentSkillsWidgetContainers[0].props('maxSkillsDisplayed')).toBe(6)
  })

  it('should display 2 courses and up to 3 skills by course if 2 courses are available', () => {
    const wrapper = mount(StudentSkillsWidget)
    const studentSkillsWidgetContainers = wrapper.findAllComponents({ name: 'StudentSkillsWidgetContainer' })
    expect(studentSkillsWidgetContainers).toHaveLength(2)
    studentSkillsWidgetContainers.forEach((container) => {
      expect(container.props('maxSkillsDisplayed')).toBe(3)
    })
  })

  it('should call navigation on button click', async () => {
    const wrapper = mount(StudentSkillsWidget)
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentSkills).toHaveBeenCalled()
  })
})
