import type { VueWrapper } from '@vue/test-utils'
import { ESkillLevelStatus, type SkillOverviewDTO } from '@/api/avenir-esr'
import StudentSkillCard from '@/features/student/skills/components/cards/StudentSkillCard/StudentSkillCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a studentSkillCard', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const skill: SkillOverviewDTO = {
    id: 'skill1',
    name: 'Résolution de problème',
    currentSkillLevel: {
      id: 'Niv1',
      name: 'Niveau 1',
      status: ESkillLevelStatus.VALIDATED
    }
  }

  const baseProps = {
    skill,
    skillColor: '--color-skill',
  } as const

  BddTest().when('the component is mounted with only one level', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: ESkillLevelStatus.UNDER_REVIEW },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    BddTest().then('it should render only one badge', async () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges).toHaveLength(1)
      expect(badges[0].props('label')).toContain('Niveau 1 en cours d\'évaluation')
    })
  })

  BddTest().when('the component is mounted with one notStartedLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: ESkillLevelStatus.NOT_STARTED },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    BddTest().then('it should render one toBeEvaluated badge', async () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges).toHaveLength(1)
      expect(badges[0].props('label')).toContain('Niveau 1 à évaluer')
    })
  })

  BddTest().when('the component is mounted with one toBeEvaluatedLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: ESkillLevelStatus.TO_BE_EVALUATED },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    BddTest().then('it should render one toBeEvaluated badge', async () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges).toHaveLength(1)
      expect(badges[0].props('label')).toContain('Niveau 1 à évaluer')
    })
  })

  BddTest().when('the component is mounted with one underReviewLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: ESkillLevelStatus.UNDER_REVIEW },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    BddTest().then('it should render one underReview badge', async () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges).toHaveLength(1)
      expect(badges[0].props('label')).toContain('Niveau 1 en cours d\'évaluation')
    })
  })

  BddTest().when('the component is mounted with one validatedLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: ESkillLevelStatus.VALIDATED },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    BddTest().then('it should render one validated badge', async () => {
      const badges = wrapper.findAll('.av-badge')
      expect(badges).toHaveLength(1)
      expect(badges[0].text()).toContain('Niveau 1 validé')
    })
  })

  BddTest().when('the component is mounted with one failedLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: ESkillLevelStatus.FAILED },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    BddTest().then('it should render one failed badge', async () => {
      const badges = wrapper.findAll('.av-badge')
      expect(badges).toHaveLength(1)
      expect(badges[0].text()).toContain('Niveau 1 non validé')
    })
  })
})
