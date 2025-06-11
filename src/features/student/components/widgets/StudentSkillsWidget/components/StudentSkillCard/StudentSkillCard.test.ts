import { SkillLevelStatus, type SkillOverviewDTO } from '@/api/avenir-esr'
import { mountWithRouter } from 'tests/utils'
import { describe, expect, it } from 'vitest'
import StudentSkillCard from './StudentSkillCard.vue'

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
    })

    expect(wrapper.text()).toContain('Résolution de problème')
    expect(wrapper.text()).toContain('4 traces')
    expect(wrapper.text()).toContain('2 mises en situation')
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
