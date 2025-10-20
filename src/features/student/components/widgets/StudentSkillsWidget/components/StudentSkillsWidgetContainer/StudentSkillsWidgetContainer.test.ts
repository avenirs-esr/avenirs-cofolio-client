import type { VueWrapper } from '@vue/test-utils'
import { ESkillLevelStatus, type SkillOverviewDTO, type StudentProgressOverviewDTO } from '@/api/avenir-esr'
import StudentSkillsWidgetContainer from '@/features/student/components/widgets/StudentSkillsWidget/components/StudentSkillsWidgetContainer/StudentSkillsWidgetContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

BddTest().given('a studentSkillsWidgetContainer', () => {
  let wrapper: VueWrapper

  const stubs = {
    StudentSkillCard: {
      name: 'StudentSkillCard',
      template: `<div class="student-skill-card"></div>`,
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const course: StudentProgressOverviewDTO = {
    id: 'course1',
    programTitle: 'Master Chimie Verte et Éco-innovations',
    skills: [
      {
        id: 'skill1',
        name: 'Prévenir la pollution à la source',
        currentSkillLevel: {
          id: 'Niv1',
          name: 'Niv.1',
          traceCount: 1,
          activityCount: 8,
          status: ESkillLevelStatus.VALIDATED
        }
      },
      {
        id: 'skill2',
        name: 'Mettre en place des filières d’économies circulaires',
        currentSkillLevel: {
          id: 'Niv1',
          name: 'Niv.1',
          traceCount: 2,
          activityCount: 7,
          status: ESkillLevelStatus.VALIDATED
        },
      },
      {
        id: 'skill3',
        name: 'Évaluer l’impact environnemental et économique',
        currentSkillLevel: {
          id: 'Niv1',
          name: 'Niv.1',
          traceCount: 3,
          activityCount: 6,
          status: ESkillLevelStatus.FAILED
        },
      },
      {
        id: 'skill4',
        name: 'Concevoir des synthèses chimiques durables',
        currentSkillLevel: {
          id: 'Niv2',
          name: 'Niv.2',
          traceCount: 4,
          activityCount: 5,
          status: ESkillLevelStatus.VALIDATED
        }
      },
      {
        id: 'skill5',
        name: 'Réaliser un circuit électrique',
        currentSkillLevel: {
          id: 'Niv1',
          name: 'Niv.1',
          traceCount: 5,
          activityCount: 4,
          status: ESkillLevelStatus.VALIDATED
        },
      },
      {
        id: 'skill6',
        name: 'Comprendre les risques électriques liés au travail en hauteur, en milieu humide, en point chaud et appréhender la consignation',
        currentSkillLevel: {
          id: 'Niv1',
          name: 'Niv.1',
          traceCount: 6,
          activityCount: 3,
          status: ESkillLevelStatus.VALIDATED
        }
      },
      {
        id: 'skill7',
        name: 'Réaliser une étude de marché',
        currentSkillLevel: {
          id: 'Niv1',
          name: 'Niv.1',
          traceCount: 7,
          activityCount: 2,
          status: ESkillLevelStatus.FAILED
        }
      },
      {
        id: 'skill8',
        name: 'Réaliser un cahier des charges fonctionnels',
        currentSkillLevel: {
          id: 'Niv2',
          name: 'Niv.2',
          traceCount: 8,
          activityCount: 1,
          status: ESkillLevelStatus.VALIDATED
        }
      },
    ] as Array<SkillOverviewDTO>
  }
  const baseProps = {
    course,
    maxSkillsDisplayed: 3,
  } as const
  const longerTitle = 'Master Électronique Énergie électrique et automatique - Spécialité Ingénierie des systèmes temps réel'

  BddTest().when('the component is mounted with given props', async () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(StudentSkillsWidgetContainer, {
        props: baseProps,
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render properly with provided props', async () => {
      const skillsCards = wrapper.findAll('.student-skill-card')

      expect(wrapper.text()).toContain(baseProps.course.programTitle)
      expect(skillsCards).toHaveLength(baseProps.maxSkillsDisplayed)
    })
  })

  BddTest().when('the component is mounted with longer titles', async () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(StudentSkillsWidgetContainer, {
        props: {
          course: {
            ...baseProps.course,
            programTitle: longerTitle
          },
          maxSkillsDisplayed: baseProps.maxSkillsDisplayed
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render truncated program tite', async () => {
      expect(wrapper.text()).toContain(`${longerTitle.slice(0, 60)}...`)
    })
  })
})
