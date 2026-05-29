import type { VueWrapper } from '@vue/test-utils'
import EnabledDisabledStatusBadge from '@/common/components/EnabledDisabledStatusBadge/EnabledDisabledStatusBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an enabled disabled status badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof EnabledDisabledStatusBadge>>

  const stubs = {
    AvBadge: AvBadgeStub,
  }

  const mountWith = (enabled: boolean, feminineLabel = true) => {
    wrapper = mount(EnabledDisabledStatusBadge, {
      props: { enabled, feminineLabel },
      global: { stubs },
    })
  }

  const findBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('feminineLabel is true (default) and enabled is true', () => {
    beforeEach(() => {
      mountWith(true)
    })

    BddTest().then('it should display a feminineLabel enabled badge', () => {
      const badge = findBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Activée')
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE)
      expect(badge.props('color')).toBe('var(--light-foreground-success)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-success)')
    })
  })

  BddTest().when('feminineLabel is true (default) and enabled is false', () => {
    beforeEach(() => {
      mountWith(false)
    })

    BddTest().then('it should display a feminineLabel disabled badge', () => {
      const badge = findBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Désactivée')
      expect(badge.props('icon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
      expect(badge.props('color')).toBe('var(--light-foreground-error)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
    })
  })

  BddTest().when('feminineLabel is false and enabled is true', () => {
    beforeEach(() => {
      mountWith(true, false)
    })

    BddTest().then('it should display a masculine enabled badge', () => {
      const badge = findBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Activé')
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE)
      expect(badge.props('color')).toBe('var(--light-foreground-success)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-success)')
    })
  })

  BddTest().when('feminineLabel is false and enabled is false', () => {
    beforeEach(() => {
      mountWith(false, false)
    })

    BddTest().then('it should display a masculine disabled badge', () => {
      const badge = findBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Désactivé')
      expect(badge.props('icon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
      expect(badge.props('color')).toBe('var(--light-foreground-error)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
    })
  })
})
