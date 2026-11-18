import type { VueWrapper } from '@vue/test-utils'
import type { WarningBadgeProps } from '@/common/components/badges/WarningBadge/WarningBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import WarningBadge from '@/common/components/badges/WarningBadge/WarningBadge.vue'

BddTest().given('a warning badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof WarningBadge>>

  const stubs = {
    AvBadge: AvBadgeStub,
  }

  const mountWith = (props: WarningBadgeProps) => {
    wrapper = mount(WarningBadge, {
      props,
      global: { stubs }
    })
  }

  const getBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('rendered with only a label', () => {
    beforeEach(() => {
      mountWith({
        label: 'Attention'
      })
    })

    BddTest().then('it should forward the label to AvBadge', () => {
      const badge = getBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Attention')
    })

    BddTest().then('it should enforce the warning colors', () => {
      const badge = getBadge()
      expect(badge.props('color')).toBe('var(--dark-background-warn)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-warn)')
      expect(badge.props('borderColor')).toBe('var(--dark-background-warn)')
    })

    BddTest().then('it should use the warning icon by default', () => {
      expect(getBadge().props('icon')).toBe(MDI_ICONS.WARNING_OUTLINE)
    })
  })

  BddTest().when('rendered with other props', () => {
    beforeEach(() => {
      mountWith({
        label: 'Attention',
        icon: MDI_ICONS.PENCIL_OUTLINE,
        small: true,
        ellipsis: true,
        noSentenceCase: true,
      })
    })

    BddTest().then('it should forward them to AvBadge', () => {
      const badge = getBadge()
      expect(badge.props('icon')).toBe(MDI_ICONS.PENCIL_OUTLINE)
      expect(badge.props('small')).toBe(true)
      expect(badge.props('ellipsis')).toBe(true)
      expect(badge.props('noSentenceCase')).toBe(true)
    })
  })
})
