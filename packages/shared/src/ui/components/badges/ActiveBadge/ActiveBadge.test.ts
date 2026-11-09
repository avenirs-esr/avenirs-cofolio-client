import type { ActiveBadgeProps } from '#shared/ui/components/badges/ActiveBadge/ActiveBadge.vue'
import type { VueWrapper } from '@vue/test-utils'
import ActiveBadge from '#shared/ui/components/badges/ActiveBadge/ActiveBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an active badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActiveBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{
    props: ActiveBadgeProps
    label: string
    icon: string
    color: string
    backgroundColor: string
  }> = [
    {
      props: { active: true, labelGender: 'FEMININE' },
      label: 'Active',
      icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-success)',
      backgroundColor: 'var(--light-background-success)',
    },
    {
      props: { active: true, labelGender: 'MASCULINE' },
      label: 'Actif',
      icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-success)',
      backgroundColor: 'var(--light-background-success)',
    },
    {
      props: { active: true, labelGender: 'NEUTRAL' },
      label: 'Actif(ve)',
      icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-success)',
      backgroundColor: 'var(--light-background-success)',
    },
    {
      props: { active: false, labelGender: 'FEMININE' },
      label: 'Inactive',
      icon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-error)',
      backgroundColor: 'var(--light-background-error)',
    },
    {
      props: { active: false, labelGender: 'MASCULINE' },
      label: 'Inactif',
      icon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-error)',
      backgroundColor: 'var(--light-background-error)',
    },
    {
      props: { active: false, labelGender: 'NEUTRAL' },
      label: 'Inactif(ve)',
      icon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-error)',
      backgroundColor: 'var(--light-background-error)',
    },
  ]

  scenario.forEach(({ props, label, icon, color, backgroundColor }) => {
    BddTest().when(`the badge is rendered with active=${props.active} and labelGender=${props.labelGender}`, () => {
      beforeEach(() => {
        wrapper = mount(ActiveBadge, { props, global: { stubs } })
      })

      BddTest().then('it should render the badge', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(true)
      })

      BddTest().then('it should render the badge label', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('label')).toContain(label)
      })

      BddTest().then('it should render the badge icon', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('icon')).toBe(icon)
      })

      BddTest().then('it should render the badge colors', () => {
        const badge = wrapper.findComponent(AvBadgeStub)

        expect(badge.props('color')).toBe(color)
        expect(badge.props('backgroundColor')).toBe(backgroundColor)
      })
    })
  })

  BddTest().when('the badge is rendered without props', () => {
    beforeEach(() => {
      wrapper = mount(ActiveBadge, { global: { stubs } })
    })

    BddTest().then('it should use the inactive and neutral defaults', () => {
      const badge = wrapper.findComponent(AvBadgeStub)

      expect(badge.props('label')).toContain('Inactif(ve)')
      expect(badge.props('icon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
      expect(badge.props('color')).toBe('var(--light-foreground-error)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
    })
  })
})
