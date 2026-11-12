import type { VueWrapper } from '@vue/test-utils'
import type { AlertStatusBadgeProps } from '@/features/global-alert/views/AlertDetailsView/components/badges/AlertStatusBadge/AlertStatusBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import AlertStatusBadge from '@/features/global-alert/views/AlertDetailsView/components/badges/AlertStatusBadge/AlertStatusBadge.vue'

BddTest().given('an alert status badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof AlertStatusBadge>>

  const NOW = new Date('2026-11-12T12:00:00')

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{
    description: string
    props: AlertStatusBadgeProps
    label: string
    icon: string
    color: string
    backgroundColor: string
  }> = [
    {
      description: 'an explicitly active alert, regardless of its dates',
      props: {
        active: true,
        startDate: '2026-11-13T12:00:00',
        endDate: '2026-11-14T12:00:00'
      },
      label: 'Active',
      icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-success)',
      backgroundColor: 'var(--light-background-success)'
    },
    {
      description: 'an alert scheduled for a future period',
      props: {
        active: false,
        startDate: '2026-11-13T12:00:00',
        endDate: '2026-11-14T12:00:00'
      },
      label: 'Programmée',
      icon: MDI_ICONS.CALENDAR_CLOCK_OUTLINE,
      color: 'var(--light-foreground-info)',
      backgroundColor: 'var(--light-background-info)'
    },
    {
      description: 'an alert within its scheduled period',
      props: {
        active: false,
        startDate: '2026-11-11T12:00:00',
        endDate: '2026-11-13T12:00:00'
      },
      label: 'Active',
      icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-success)',
      backgroundColor: 'var(--light-background-success)'
    },
    {
      description: 'an alert whose scheduled period has expired',
      props: {
        active: false,
        startDate: '2026-11-10T12:00:00',
        endDate: '2026-11-11T12:00:00'
      },
      label: 'Inactive',
      icon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-error)',
      backgroundColor: 'var(--light-background-error)'
    },
    {
      description: 'an alert without scheduled dates',
      props: {
        active: false,
        startDate: undefined,
        endDate: undefined
      },
      label: 'Inactive',
      icon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-error)',
      backgroundColor: 'var(--light-background-error)'
    },
    {
      description: 'an alert with an undefined active state and a future period',
      props: {
        active: undefined,
        startDate: '2026-11-13T12:00:00',
        endDate: '2026-11-14T12:00:00'
      },
      label: 'Programmée',
      icon: MDI_ICONS.CALENDAR_CLOCK_OUTLINE,
      color: 'var(--light-foreground-info)',
      backgroundColor: 'var(--light-background-info)'
    },
    {
      description: 'an alert with an undefined active state and no dates',
      props: {
        active: undefined,
        startDate: undefined,
        endDate: undefined
      },
      label: 'Inactive',
      icon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-error)',
      backgroundColor: 'var(--light-background-error)'
    }
  ]

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  scenario.forEach(({ description, props, label, icon, color, backgroundColor }) => {
    BddTest().when(`the badge is rendered with ${description}`, () => {
      beforeEach(() => {
        wrapper = mount(AlertStatusBadge, {
          props,
          global: { stubs }
        })
      })

      BddTest().then('it should render the badge', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(true)
      })

      BddTest().then('it should render the correct badge label', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('label')).toBe(label)
      })

      BddTest().then('it should render the correct badge icon', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('icon')).toBe(icon)
      })

      BddTest().then('it should render the correct badge colors', () => {
        const badge = wrapper.findComponent(AvBadgeStub)

        expect(badge.props('color')).toBe(color)
        expect(badge.props('backgroundColor')).toBe(backgroundColor)
      })
    })
  })

  BddTest().when('the alert period starts exactly now', () => {
    beforeEach(() => {
      wrapper = mount(AlertStatusBadge, {
        props: {
          active: false,
          startDate: NOW,
          endDate: '2026-11-13T12:00:00'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the active badge', () => {
      const badge = wrapper.findComponent(AvBadgeStub)

      expect(badge.props('label')).toBe('Active')
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE_OUTLINE)
    })
  })

  BddTest().when('the alert period ends exactly now', () => {
    beforeEach(() => {
      wrapper = mount(AlertStatusBadge, {
        props: {
          active: false,
          startDate: '2026-11-11T12:00:00',
          endDate: NOW
        },
        global: { stubs }
      })
    })

    BddTest().then('it should still render the active badge', () => {
      const badge = wrapper.findComponent(AvBadgeStub)

      expect(badge.props('label')).toBe('Active')
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE_OUTLINE)
    })
  })
})
