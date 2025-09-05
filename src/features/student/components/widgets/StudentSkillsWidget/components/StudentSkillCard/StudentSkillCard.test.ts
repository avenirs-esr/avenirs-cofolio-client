import { SkillLevelStatus, type SkillOverviewDTO } from '@/api/avenir-esr'
import StudentSkillCard from '@/features/student/components/widgets/StudentSkillsWidget/components/StudentSkillCard/StudentSkillCard.vue'
import { mountWithRouter } from '@/ui/tests/utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('given a studentSkillCard', () => {
  let wrapper: VueWrapper

  const stubs = {
    DsfrBadge: {
      name: 'DsfrBadge',
      template: `<div class="dsfr-badge" :class="['fr-badge--' + type]">{{ label }}</div>`,
      props: ['label', 'type', 'small', 'ellipsis'],
    },
    VIcon: {
      name: 'VIcon',
      props: ['name'],
      template: '<i class="mock-v-icon" />',
    },
    StudentCountTracesIconText: {
      name: 'StudentCountTracesIconText',
      template: `<div class="student-count-traces-icon-text" />`,
      props: ['countTraces']
    },
    StudentCountAmsIconText: {
      name: 'StudentCountAmsIconText',
      template: `<div class="student-count-ams-icon-text" />`,
      props: ['countAms']
    },
    RouterLink: RouterLinkStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const skill: SkillOverviewDTO = {
    id: 'skill1',
    name: 'Résolution de problème',
    currentSkillLevel: {
      id: 'Niv1',
      name: 'Niveau 1',
      traceCount: 4,
      activityCount: 2,
      status: SkillLevelStatus.VALIDATED
    }
  }

  const baseProps = {
    skill,
    skillColor: '--color-skill',
  } as const

  describe('when the component is mounted', async () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: baseProps,
        global: {
          stubs
        }
      })
    })

    it('then it should render skill name, trace and activity counts', async () => {
      expect(wrapper.text()).toContain('Résolution de problème')
      const amsIconText = wrapper.findComponent({ name: 'StudentCountAmsIconText' })
      expect(amsIconText.exists()).toBe(true)
      expect(amsIconText.props()).toMatchObject({ countAms: baseProps.skill.currentSkillLevel.activityCount })
      const tracesIconText = wrapper.findComponent({ name: 'StudentCountTracesIconText' })
      expect(tracesIconText.exists()).toBe(true)
      expect(tracesIconText.props()).toMatchObject({ countTraces: baseProps.skill.currentSkillLevel.traceCount })
    })
  })

  describe('when the component is mounted with only one level', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: SkillLevelStatus.UNDER_REVIEW },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    it('then it should render only one badge', async () => {
      const badges = wrapper.findAll('.fr-badge')
      expect(badges).toHaveLength(1)
      expect(badges[0].text()).toContain('Niveau 1 en cours d\'évaluation')
    })
  })

  describe('when the component is mounted with one notStartedLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: SkillLevelStatus.NOT_STARTED },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    it('then it should render one toBeEvaluated badge', async () => {
      const badges = wrapper.findAll('.fr-badge')
      expect(badges).toHaveLength(1)
      expect(badges[0].text()).toContain('Niveau 1 à évaluer')
    })
  })

  describe('when the component is mounted with one toBeEvaluatedLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: SkillLevelStatus.TO_BE_EVALUATED },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    it('then it should render one toBeEvaluated badge', async () => {
      const badges = wrapper.findAll('.fr-badge')
      expect(badges).toHaveLength(1)
      expect(badges[0].text()).toContain('Niveau 1 à évaluer')
    })
  })

  describe('when the component is mounted with one underReviewLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: SkillLevelStatus.UNDER_REVIEW },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    it('then it should render one underReview badge', async () => {
      const badges = wrapper.findAll('.fr-badge')
      expect(badges).toHaveLength(1)
      expect(badges[0].text()).toContain('Niveau 1 en cours d\'évaluation')
    })
  })

  describe('when the component is mounted with one validatedLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: SkillLevelStatus.VALIDATED },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    it('then it should render one validated badge', async () => {
      const badges = wrapper.findAll('.fr-badge')
      expect(badges).toHaveLength(1)
      expect(badges[0].text()).toContain('Niveau 1 validé')
    })
  })

  describe('when the component is mounted with one failedLevel', async () => {
    beforeEach(async () => {
      const skill: SkillOverviewDTO = {
        ...baseProps.skill,
        currentSkillLevel: { ...baseProps.skill.currentSkillLevel, status: SkillLevelStatus.FAILED },
      }
      wrapper = await mountWithRouter(StudentSkillCard, {
        props: {
          ...baseProps,
          skill
        },
      })
    })

    it('then it should render one failed badge', async () => {
      const badges = wrapper.findAll('.fr-badge')
      expect(badges).toHaveLength(1)
      expect(badges[0].text()).toContain('Niveau 1 non validé')
    })
  })
})
