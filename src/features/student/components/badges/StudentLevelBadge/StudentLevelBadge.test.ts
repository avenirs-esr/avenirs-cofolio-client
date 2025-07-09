import { type SkillLevelOverviewDTO, SkillLevelStatus } from '@/api/avenir-esr'
import StudentLevelBadge from '@/features/student/components/badges/StudentLevelBadge/StudentLevelBadge.vue'
import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'

describe('studentLevelBadge', () => {
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

  const notStartedLevel = { id: 'NOT_STARTED', name: 'NOT_STARTED', status: SkillLevelStatus.NOT_STARTED } as SkillLevelOverviewDTO
  const notValidatedLevel = { id: 'NOT_VALIDATED', name: 'NOT_VALIDATED', status: SkillLevelStatus.FAILED } as SkillLevelOverviewDTO
  const toEvaluateLevel = { id: 'TO_EVALUATE', name: 'TO_EVALUATE', status: SkillLevelStatus.TO_BE_EVALUATED } as SkillLevelOverviewDTO
  const underReviewLevel = { id: 'UNDER_REVIEW', name: 'UNDER_REVIEW', status: SkillLevelStatus.UNDER_REVIEW } as SkillLevelOverviewDTO
  const validatedLevel = { id: 'VALIDATED', name: 'VALIDATED', status: SkillLevelStatus.VALIDATED } as SkillLevelOverviewDTO

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should pass correct properties to AvBadge with notValidatedLevel', () => {
    const wrapper = mount(StudentLevelBadge, {
      props: { level: notValidatedLevel },
      global: {
        stubs
      }
    })

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

  it('should pass correct properties to AvBadge with notStartedLevel', () => {
    const wrapper = mount(StudentLevelBadge, {
      props: { level: notStartedLevel },
      global: {
        stubs
      }
    })

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

  it('should pass correct properties to AvBadge with toEvaluateLevel', () => {
    const wrapper = mount(StudentLevelBadge, {
      props: { level: toEvaluateLevel },
      global: {
        stubs
      }
    })

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

  it('should pass correct properties to AvBadge with underReviewLevel', () => {
    const wrapper = mount(StudentLevelBadge, {
      props: { level: underReviewLevel },
      global: {
        stubs
      }
    })

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

  it('should pass correct properties to AvBadge with validatedLevel', () => {
    const wrapper = mount(StudentLevelBadge, {
      props: { level: validatedLevel },
      global: {
        stubs
      }
    })

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
