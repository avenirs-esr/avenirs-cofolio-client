import { SkillLevelStatus, type SkillOverviewDTO } from '@/api/avenir-esr'
import StudentSkillCard from '@/features/student/components/widgets/StudentSkillsWidget/components/StudentSkillCard/StudentSkillCard.vue'
import { mountWithRouter } from '@/ui/tests/utils'
import { RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

vi.doMock('@gouvminint/vue-dsfr', () => ({
  DsfrBadge: {
    name: 'DsfrBadge',
    template: `<div class="dsfr-badge" :class="['fr-badge--' + type]">{{ label }}</div>`,
    props: ['label', 'type', 'small', 'ellipsis'],
  },
  VIcon: defineComponent({
    name: 'VIcon',
    props: ['name'],
    template: '<i class="mock-v-icon" />',
  }),
}))

vi.doMock('@/ui/tokens', () => ({
  MDI_ICONS: {
    ATTACH_FILE: 'mdi-attach-file',
    TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
  },
}))

describe('studentSkillCard.vue', () => {
  const stubs = {
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
    traceCount: 4,
    activityCount: 2,
    currentSkillLevel: { id: 'Niv1', name: 'Niveau 1', status: SkillLevelStatus.VALIDATED }
  }
  const baseProps = {
    skill,
    skillColor: '--color-skill',
  } as const

  it('renders skill name, trace and activity counts', async () => {
    const wrapper = await mountWithRouter(StudentSkillCard, {
      props: baseProps,
      global: {
        stubs
      }
    })

    expect(wrapper.text()).toContain('Résolution de problème')
    const amsIconText = wrapper.findComponent({ name: 'StudentCountAmsIconText' })
    expect(amsIconText.exists()).toBe(true)
    expect(amsIconText.props()).toMatchObject({ countAms: baseProps.skill.activityCount })
    const tracesIconText = wrapper.findComponent({ name: 'StudentCountTracesIconText' })
    expect(tracesIconText.exists()).toBe(true)
    expect(tracesIconText.props()).toMatchObject({ countTraces: baseProps.skill.traceCount })
  })

  it('renders only one badge if only one level is present', async () => {
    const skill: SkillOverviewDTO = {
      ...baseProps.skill,
      currentSkillLevel: { id: 'Niv1', name: 'Niveau 1', status: SkillLevelStatus.UNDER_REVIEW },
    }
    const wrapper = await mountWithRouter(StudentSkillCard, {
      props: {
        ...baseProps,
        skill
      },
    })

    const badges = wrapper.findAll('.fr-badge')
    expect(badges).toHaveLength(1)
    expect(badges[0].text()).toContain('Niveau 1 en cours d\'évaluation')
  })

  it('renders one toBeEvaluated badge if one notStartedLevel is present', async () => {
    const skill: SkillOverviewDTO = {
      ...baseProps.skill,
      currentSkillLevel: { id: 'Niv1', name: 'Niveau 1', status: SkillLevelStatus.NOT_STARTED },
    }
    const wrapper = await mountWithRouter(StudentSkillCard, {
      props: {
        ...baseProps,
        skill
      },
    })

    const badges = wrapper.findAll('.fr-badge')
    expect(badges).toHaveLength(1)
    expect(badges[0].text()).toContain('Niveau 1 à évaluer')
  })

  it('renders one toBeEvaluated badge if one toBeEvaluatedLevel is present', async () => {
    const skill: SkillOverviewDTO = {
      ...baseProps.skill,
      currentSkillLevel: { id: 'Niv1', name: 'Niveau 1', status: SkillLevelStatus.TO_BE_EVALUATED },
    }
    const wrapper = await mountWithRouter(StudentSkillCard, {
      props: {
        ...baseProps,
        skill
      },
    })

    const badges = wrapper.findAll('.fr-badge')
    expect(badges).toHaveLength(1)
    expect(badges[0].text()).toContain('Niveau 1 à évaluer')
  })

  it('renders one underReview badge if one underReviewLevel is present', async () => {
    const skill: SkillOverviewDTO = {
      ...baseProps.skill,
      currentSkillLevel: { id: 'Niv1', name: 'Niveau 1', status: SkillLevelStatus.UNDER_REVIEW },
    }
    const wrapper = await mountWithRouter(StudentSkillCard, {
      props: {
        ...baseProps,
        skill
      },
    })

    const badges = wrapper.findAll('.fr-badge')
    expect(badges).toHaveLength(1)
    expect(badges[0].text()).toContain('Niveau 1 en cours d\'évaluation')
  })

  it('renders one validated badge if one validatedLevel is present', async () => {
    const skill: SkillOverviewDTO = {
      ...baseProps.skill,
      currentSkillLevel: { id: 'Niv1', name: 'Niveau 1', status: SkillLevelStatus.VALIDATED },
    }
    const wrapper = await mountWithRouter(StudentSkillCard, {
      props: {
        ...baseProps,
        skill
      },
    })

    const badges = wrapper.findAll('.fr-badge')
    expect(badges).toHaveLength(1)
    expect(badges[0].text()).toContain('Niveau 1 validé')
  })

  it('renders one failed badge if one failedLevel is present', async () => {
    const skill: SkillOverviewDTO = {
      ...baseProps.skill,
      currentSkillLevel: { id: 'Niv1', name: 'Niveau 1', status: SkillLevelStatus.FAILED },
    }
    const wrapper = await mountWithRouter(StudentSkillCard, {
      props: {
        ...baseProps,
        skill
      },
    })

    const badges = wrapper.findAll('.fr-badge')
    expect(badges).toHaveLength(1)
    expect(badges[0].text()).toContain('Niveau 1 non validé')
  })
})
