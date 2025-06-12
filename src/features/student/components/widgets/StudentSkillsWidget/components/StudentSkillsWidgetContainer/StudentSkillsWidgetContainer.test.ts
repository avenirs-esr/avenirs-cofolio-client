import { type ProgramProgressOverviewDTO, SkillLevelStatus, type SkillOverviewDTO } from '@/api/avenir-esr'

import { mountWithRouter } from 'tests/utils'
import StudentSkillsWidgetContainer from './StudentSkillsWidgetContainer.vue'

describe('studentSkillsWidgetContainer', () => {
  const stubs = {
    StudentSkillCard: {
      name: 'StudentSkillCard',
      template: `<div class="student-skill-card"></div>`,
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })
  const course: ProgramProgressOverviewDTO = {
    id: 'course1',
    name: 'Master Chimie Verte et Éco-innovations',
    skills: [
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
        currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.VALIDATED },
      },
      {
        id: 'skill3',
        name: 'Évaluer l’impact environnemental et économique',
        traceCount: 3,
        activityCount: 6,
        currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.FAILED },
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
        currentSkillLevel: { id: 'Niv1', name: 'Niv.1', status: SkillLevelStatus.VALIDATED },
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
    ] as Array<SkillOverviewDTO>
  }
  const baseProps = {
    course,
    maxSkillsDisplayed: 3,
  } as const
  const longerName = 'Master Électronique Énergie électrique et automatique - Spécialité Ingénierie des systèmes temps réel'

  it('should render properly with provided props', async () => {
    const wrapper = await mountWithRouter(StudentSkillsWidgetContainer, {
      props: baseProps,
      global: {
        stubs
      }
    })

    const skillsCards = wrapper.findAll('.student-skill-card')

    expect(wrapper.text()).toContain(baseProps.course.name)
    expect(skillsCards).toHaveLength(baseProps.maxSkillsDisplayed)
  })

  it('should render truncated course name for longer names', async () => {
    const wrapper = await mountWithRouter(StudentSkillsWidgetContainer, {
      props: {
        course: {
          ...baseProps.course,
          name: longerName
        },
        maxSkillsDisplayed: baseProps.maxSkillsDisplayed
      },
      global: {
        stubs
      }
    })

    expect(wrapper.text()).toContain(`${longerName.slice(0, 60)}...`)
  })
})
