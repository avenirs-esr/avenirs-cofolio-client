import type { VueWrapper } from '@vue/test-utils'
import type { ComponentProps } from 'vue-component-type-helpers'
import WarningBadge from '@/common/components/badges/WarningBadge/WarningBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a warning badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof WarningBadge>>

  const stubs = {
    AvBadge: AvBadgeStub,
  }

  const mountWith = (props: ComponentProps<typeof WarningBadge>) => {
    wrapper = mount(WarningBadge, {
      props,
      global: { stubs },
    })
  }

  const findBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('rendered with standard badge props', () => {
    beforeEach(() => {
      mountWith({
        label: 'Attention',
        icon: MDI_ICONS.ALERT_OUTLINE,
      })
    })

    BddTest().then('it should forward the label and icon to AvBadge', () => {
      const badge = findBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Attention')
      expect(badge.props('icon')).toBe(MDI_ICONS.ALERT_OUTLINE)
    })

    BddTest().then('it should enforce the warning colors', () => {
      const badge = findBadge()
      expect(badge.props('color')).toBe('var(--dark-background-warn)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-warn)')
    })
  })

  BddTest().when('rendered with additional badge props', () => {
    beforeEach(() => {
      mountWith({
        label: 'Attention',
        icon: MDI_ICONS.ALERT_OUTLINE,
        borderColor: 'transparent',
        small: true
      })
    })

    BddTest().then('it should forward the remaining props to AvBadge', () => {
      const badge = findBadge()
      expect(badge.props('borderColor')).toBe('transparent')
      expect(badge.props('small')).toBe(true)
    })
  })
})
