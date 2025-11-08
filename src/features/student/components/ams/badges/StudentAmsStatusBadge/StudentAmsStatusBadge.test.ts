import { EAmsStatus } from '@/api/avenir-esr'
import StudentAmsStatusBadge from '@/features/student/components/ams/badges/StudentAmsStatusBadge/StudentAmsStatusBadge.vue'
import { ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

BddTest().given('a student AMS status badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentAmsStatusBadge>>

  const stubs = {
    AvBadge: AvBadgeStub,
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
        iconDataUrl: ICONS_DATA_URL.MDI_CALENDAR_CHECK_OUTLINE
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
        iconDataUrl: ICONS_DATA_URL.MDI_CALENDAR_RANGE_OUTLINE
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
        iconDataUrl: ICONS_DATA_URL.MDI_CALENDAR_CLOCK_OUTLINE
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
        iconDataUrl: ICONS_DATA_URL.MDI_DOTS_HORIZONTAL_CIRCLE_OUTLINE
      })
    })
  })
})
