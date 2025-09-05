import { type SkillLevelProgressOverviewDTO, SkillLevelStatus } from '@/api/avenir-esr'
import StudentLevelBadge from '@/features/student/components/badges/StudentLevelBadge/StudentLevelBadge.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it } from 'vitest'

describe('given a studentLevelBadge', () => {
  let wrapper: VueWrapper

  const basePath = import.meta.env.BASE_URL
  const stubs = {
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
  }

  const notStartedLevel: SkillLevelProgressOverviewDTO = {
    id: 'NOT_STARTED',
    name: 'NOT_STARTED',
    traceCount: 0,
    activityCount: 0,
    status: SkillLevelStatus.NOT_STARTED
  }
  const notValidatedLevel: SkillLevelProgressOverviewDTO = {
    id: 'NOT_VALIDATED',
    name: 'NOT_VALIDATED',
    traceCount: 0,
    activityCount: 0,
    status: SkillLevelStatus.FAILED
  }
  const toEvaluateLevel: SkillLevelProgressOverviewDTO = {
    id: 'TO_EVALUATE',
    name: 'TO_EVALUATE',
    traceCount: 0,
    activityCount: 0,
    status: SkillLevelStatus.TO_BE_EVALUATED
  }
  const underReviewLevel: SkillLevelProgressOverviewDTO = {
    id: 'UNDER_REVIEW',
    name: 'UNDER_REVIEW',
    traceCount: 0,
    activityCount: 0,
    status: SkillLevelStatus.UNDER_REVIEW
  }
  const validatedLevel: SkillLevelProgressOverviewDTO = {
    id: 'VALIDATED',
    name: 'VALIDATED',
    traceCount: 0,
    activityCount: 0,
    status: SkillLevelStatus.VALIDATED
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when the component is mounted with a notValidatedLevel', () => {
    beforeEach(() => {
      wrapper = mount(StudentLevelBadge, {
        props: { level: notValidatedLevel },
        global: {
          stubs
        }
      })
    })

    it('then it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Non validé',
        small: true,
        ellipsis: true,
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconPath: `${basePath}assets/icons/close-circle-outline.svg`
      })
    })
  })

  describe('when the component is mounted with a notStartedLevel', () => {
    beforeEach(() => {
      wrapper = mount(StudentLevelBadge, {
        props: { level: notStartedLevel },
        global: {
          stubs
        }
      })
    })

    it('then it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'En cours d\'acquisition',
        small: true,
        ellipsis: true,
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: `${basePath}assets/icons/hourglass.svg`
      })
    })
  })

  describe('when the component is mounted with a toEvaluateLevel', () => {
    beforeEach(() => {
      wrapper = mount(StudentLevelBadge, {
        props: { level: toEvaluateLevel },
        global: {
          stubs
        }
      })
    })

    it('then it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'En cours d\'acquisition',
        small: true,
        ellipsis: true,
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: `${basePath}assets/icons/hourglass.svg`
      })
    })
  })

  describe('when the component is mounted with an underReviewLevel', () => {
    beforeEach(() => {
      wrapper = mount(StudentLevelBadge, {
        props: { level: underReviewLevel },
        global: {
          stubs
        }
      })
    })

    it('then it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Soumis pour évaluation',
        small: true,
        ellipsis: true,
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: `${basePath}assets/icons/dots-horizontal-circle-outline.svg`
      })
    })
  })

  describe('when the component is mounted with a validatedLevel', () => {
    beforeEach(() => {
      wrapper = mount(StudentLevelBadge, {
        props: { level: validatedLevel },
        global: {
          stubs
        }
      })
    })

    it('then it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Validé',
        small: true,
        ellipsis: true,
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconPath: `${basePath}assets/icons/check-circle.svg`
      })
    })
  })
})
