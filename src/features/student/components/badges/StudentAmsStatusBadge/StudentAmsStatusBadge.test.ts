import { AmsStatus } from '@/types'
import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import StudentAmsStatusBadge from './StudentAmsStatusBadge.vue'

describe('studentAmsStatusBadge', () => {
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
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should pass correct properties to AvBadge with AmsStatus.COMPLETED', () => {
    const wrapper = mount(StudentAmsStatusBadge, {
      props: { status: AmsStatus.COMPLETED },
      global: {
        stubs
      }
    })

    const badge = wrapper.findComponent({ name: 'AvBadge' })

    expect(badge.exists()).toBe(true)
    expect(badge.props()).toMatchObject({
      label: 'Terminée',
      small: true,
      ellipsis: true,
      color: 'var(--light-foreground-neutral)',
      backgroundColor: 'var(--light-background-neutral)',
      iconPath: '/assets/icons/calendar-check-outline.svg'
    })
  })

  it('should pass correct properties to AvBadge with AmsStatus.IN_PROGRESS', () => {
    const wrapper = mount(StudentAmsStatusBadge, {
      props: { status: AmsStatus.IN_PROGRESS },
      global: {
        stubs
      }
    })

    const badge = wrapper.findComponent({ name: 'AvBadge' })

    expect(badge.exists()).toBe(true)
    expect(badge.props()).toMatchObject({
      label: 'En cours',
      small: true,
      ellipsis: true,
      color: 'var(--dark-background-primary1)',
      backgroundColor: 'var(--light-background-primary2)',
      iconPath: '/assets/icons/calendar-range-outline.svg'
    })
  })

  it('should pass correct properties to AvBadge with AmsStatus.NOT_STARTED', () => {
    const wrapper = mount(StudentAmsStatusBadge, {
      props: { status: AmsStatus.NOT_STARTED },
      global: {
        stubs
      }
    })

    const badge = wrapper.findComponent({ name: 'AvBadge' })

    expect(badge.exists()).toBe(true)
    expect(badge.props()).toMatchObject({
      label: 'Non initiée',
      small: true,
      ellipsis: true,
      color: 'var(--foreground-text2)',
      backgroundColor: 'var(--white)',
      iconPath: '/assets/icons/calendar-clock-outline.svg'
    })
  })

  it('should pass correct properties to AvBadge with AmsStatus.SUBMITTED', () => {
    const wrapper = mount(StudentAmsStatusBadge, {
      props: { status: AmsStatus.SUBMITTED },
      global: {
        stubs
      }
    })

    const badge = wrapper.findComponent({ name: 'AvBadge' })

    expect(badge.exists()).toBe(true)
    expect(badge.props()).toMatchObject({
      label: 'Soumise pour évaluation',
      small: true,
      ellipsis: true,
      color: 'var(--light-foreground-primary1)',
      backgroundColor: 'var(--light-background-critical)',
      iconPath: '/assets/icons/dots-horizontal-circle-outline.svg'
    })
  })
})
