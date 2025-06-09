import { LevelStatus, type SkillOverviewDTO } from '@/types'
import { mountWithRouter } from 'tests/utils'
import StudentSkillsWidgetContainer from './StudentSkillsWidgetContainer.vue'

vi.mock('@/features/student/components', () => ({
  StudentSkillCard: {
    name: 'StudentSkillCard',
    template: `<div class="student-skill-card"></div>`,
  }
}))

describe('studentSkillsWidgetContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const baseProps = {
    course: {
      id: 'course1',
      name: 'Master Chimie Verte et Éco-innovations',
      skills: [
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
      ] as Array<SkillOverviewDTO>
    },
    maxSkillsDisplayed: 3,
  } as const
  const longerName = 'Master Électronique Énergie électrique et automatique - Spécialité Ingénierie des systèmes temps réel'

  it('should render properly with provided props', async () => {
    const wrapper = await mountWithRouter(StudentSkillsWidgetContainer, {
      props: baseProps,
    })

    const skillsCards = wrapper.findAll('.student-skill-card')

    expect(wrapper.text()).toContain(baseProps.course.name)
    expect(skillsCards).toHaveLength(baseProps.maxSkillsDisplayed)
  })

  it('should render truncated course name for longer names', async () => {
    const wrapper = await mountWithRouter(StudentSkillsWidgetContainer, {
      props: { course: { ...baseProps.course, name: longerName }, maxSkillsDisplayed: baseProps.maxSkillsDisplayed },
    })

    expect(wrapper.text()).toContain(`${longerName.slice(0, 60)}...`)
  })
})
