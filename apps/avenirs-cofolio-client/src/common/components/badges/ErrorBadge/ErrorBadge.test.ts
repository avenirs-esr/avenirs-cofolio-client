import type { VueWrapper } from '@vue/test-utils'
import type { ErrorBadgeProps } from '@/common/components/badges/ErrorBadge/ErrorBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import ErrorBadge from '@/common/components/badges/ErrorBadge/ErrorBadge.vue'

BddTest().given('an error badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ErrorBadge>>

  const stubs = {
    AvBadge: AvBadgeStub,
  }

  const mountWith = (props: ErrorBadgeProps) => {
    wrapper = mount(ErrorBadge, {
      props,
      global: { stubs }
    })
  }

  const getBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('rendered with only a label', () => {
    beforeEach(() => {
      mountWith({
        label: 'Erreur'
      })
    })

    BddTest().then('it should forward the label to AvBadge', () => {
      const badge = getBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Erreur')
    })

    BddTest().then('it should enforce the error colors', () => {
      const badge = getBadge()
      expect(badge.props('color')).toBe('var(--dark-background-error)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
      expect(badge.props('borderColor')).toBe('var(--dark-background-error)')
    })

    BddTest().then('it should use the error icon by default', () => {
      expect(getBadge().props('icon')).toBe(MDI_ICONS.CLOSE_OCTAGON)
    })
  })

  BddTest().when('rendered with other props', () => {
    beforeEach(() => {
      mountWith({
        label: 'Erreur',
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
