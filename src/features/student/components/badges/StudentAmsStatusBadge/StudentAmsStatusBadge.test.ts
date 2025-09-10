import { EAmsStatus } from '@/api/avenir-esr'
import StudentAmsStatusBadge from '@/features/student/components/badges/StudentAmsStatusBadge/StudentAmsStatusBadge.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

BddTest().given('a student AMS status badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentAmsStatusBadge>>

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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('providing the status AmsStatus.COMPLETED', () => {
    beforeEach(() => {
      wrapper = mount(StudentAmsStatusBadge, {
        props: { status: EAmsStatus.COMPLETED },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass corect properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Terminée',
        small: true,
        ellipsis: true,
        color: 'var(--light-foreground-neutral)',
        backgroundColor: 'var(--light-background-neutral)',
        iconPath: `${basePath}assets/icons/calendar-check-outline.svg`
      })
    })
  })

  BddTest().when('providing the status AmsStatus.IN_PROGRESS', () => {
    beforeEach(() => {
      wrapper = mount(StudentAmsStatusBadge, {
        props: { status: EAmsStatus.IN_PROGRESS },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass corect properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'En cours',
        small: true,
        ellipsis: true,
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: `${basePath}assets/icons/calendar-range-outline.svg`
      })
    })
  })

  BddTest().when('providing the status AmsStatus.NOT_STARTED', () => {
    beforeEach(() => {
      wrapper = mount(StudentAmsStatusBadge, {
        props: { status: EAmsStatus.NOT_STARTED },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass corect properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Non initiée',
        small: true,
        ellipsis: true,
        color: 'var(--text2)',
        backgroundColor: 'var(--other-background-base)',
        iconPath: `${basePath}assets/icons/calendar-clock-outline.svg`
      })
    })
  })

  BddTest().when('providing the status AmsStatus.SUBMITTED', () => {
    beforeEach(() => {
      wrapper = mount(StudentAmsStatusBadge, {
        props: { status: EAmsStatus.SUBMITTED },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass corect properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Soumise pour évaluation',
        small: true,
        ellipsis: true,
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: `${basePath}assets/icons/dots-horizontal-circle-outline.svg`
      })
    })
  })
})
