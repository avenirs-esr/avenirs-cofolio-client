import { mockedPrograms } from '@/features/student/queries/utils'
import { LevelStatus } from '@/types'
import { RouterLinkStub } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import StudentDetailedSkillCard from './StudentDetailedSkillCard.vue'

vi.doMock('@/ui/tokens', () => ({
  MDI_ICONS: {
    ATTACH_FILE: 'mdi-attach-file',
    TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
  },
}))

describe('studentDetailedSkillCard.vue', () => {
  let mathRandomSpy: MockInstance

  const stubs = {
    DsfrBadge: {
      name: 'DsfrBadge',
      template: `<div class="dsfr-badge" />`,
      props: ['label', 'type', 'small', 'ellipsis']
    },
    VIcon: {
      name: 'VIcon',
      props: ['name'],
      template: '<i class="mock-v-icon" />',
    },
    StudentLevelBadge: {
      name: 'StudentLevelBadge',
      props: ['level'],
      template: '<div class="mock-student-level-badge" />',
    },
    AvBadge: {
      name: 'AvBadge',
      template: `<div class="av-badge"/>`,
      props: {
        label: String,
        small: {
          type: Boolean,
          default: false
        },
        ellipsis: {
          type: Boolean,
          default: false
        },
        color: String,
        backgroundColor: String,
        iconPath: String
      }
    },
    RouterLink: RouterLinkStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mathRandomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    mathRandomSpy.mockRestore()
  })

  const skill = mockedPrograms[0].skills[0]

  const skillNotValidated = {
    ...skill,
    currentLevel: {
      ...skill.currentLevel,
      status: LevelStatus.NOT_VALIDATED
    }
  }
  const skillToEvaluate = {
    ...skill,
    currentLevel: {
      ...skill.currentLevel,
      status: LevelStatus.TO_EVALUATE
    }
  }
  const skillUnderReview = {
    ...skill,
    currentLevel: {
      ...skill.currentLevel,
      status: LevelStatus.UNDER_REVIEW
    }
  }
  const skillValidated = {
    ...skill,
    currentLevel: {
      ...skill.currentLevel,
      status: LevelStatus.VALIDATED
    }
  }

  const baseProps = {
    skill,
    skillColor: '--color-skill',
  } as const
  const skillNotValidatedProps = {
    skill: skillNotValidated,
    skillColor: '--color-skill'
  } as const
  const skillToEvaluateProps = {
    skill: skillToEvaluate,
    skillColor: '--color-skill'
  } as const
  const skillUnderReviewProps = {
    skill: skillUnderReview,
    skillColor: '--color-skill'
  } as const
  const skillValidatedProps = {
    skill: skillValidated,
    skillColor: '--color-skill'
  } as const

  it('should render properly with given props', async () => {
    const wrapper = await mountWithRouter(StudentDetailedSkillCard, {
      props: baseProps,
      global: {
        stubs
      }
    })

    expect(wrapper.text()).toContain(skill.name)
    expect(wrapper.text()).toContain(`${skill.trackCount} traces`)
    expect(wrapper.text()).toContain(`${skill.activityCount} mises en situation`)
  })

  it('should not render level badge with skill not validated', async () => {
    const wrapper = await mountWithRouter(StudentDetailedSkillCard, {
      props: skillNotValidatedProps,
      global: {
        stubs
      }
    })

    expect(wrapper.findComponent('.mock-student-level-badge').exists()).toBe(false)
  })

  it('should render level badge with skill to evaluate', async () => {
    const wrapper = await mountWithRouter(StudentDetailedSkillCard, {
      props: skillToEvaluateProps,
      global: {
        stubs
      }
    })

    expect(wrapper.findComponent('.mock-student-level-badge').exists()).toBe(true)
  })

  it('should render level badge with skill under review', async () => {
    const wrapper = await mountWithRouter(StudentDetailedSkillCard, {
      props: skillUnderReviewProps,
      global: {
        stubs
      }
    })

    expect(wrapper.findComponent('.mock-student-level-badge').exists()).toBe(true)
  })

  it('should not render level badge with skill validated', async () => {
    const wrapper = await mountWithRouter(StudentDetailedSkillCard, {
      props: skillValidatedProps,
      global: {
        stubs
      }
    })

    expect(wrapper.findComponent('.mock-student-level-badge').exists()).toBe(false)
  })

  it('should render AvBadge when mockedFeedbackCount is greater than 0', async () => {
    mathRandomSpy.mockReturnValue(0.9)
    const wrapper = await mountWithRouter(StudentDetailedSkillCard, {
      props: baseProps,
      data () {
        return {
          mockedFeedbackCount: 5,
        }
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent('.student-detailed-skill-card__feedback-badge').exists()).toBe(true)
  })

  it('should not render AvBadge when mockedFeedbackCount is 0', async () => {
    mathRandomSpy.mockReturnValue(0)
    const wrapper = await mountWithRouter(StudentDetailedSkillCard, {
      props: baseProps,
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent('.student-detailed-skill-card__feedback-badge').exists()).toBe(false)
  })
})
