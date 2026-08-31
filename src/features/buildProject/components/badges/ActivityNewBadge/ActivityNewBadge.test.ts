import ActivityNewBadge from '@/features/buildProject/components/badges/ActivityNewBadge/ActivityNewBadge.vue'
import { IX_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity new badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityNewBadge>>

  const stubs = {
    AvBadge: AvBadgeStub
  }

  beforeEach(() => {
    wrapper = mount(ActivityNewBadge, {
      global: { stubs }
    })
  })

  BddTest().then('it should render AvBadge', () => {
    const badge = wrapper.findComponent({ name: 'AvBadge' })
    expect(badge.exists()).toBe(true)
  })

  BddTest().then('it should use the LIBRARY_NEW icon', () => {
    const badge = wrapper.findComponent({ name: 'AvBadge' })
    expect(badge.props('icon')).toBe(IX_ICONS.LIBRARY_NEW)
  })

  BddTest().then('it should use success colors', () => {
    const badge = wrapper.findComponent({ name: 'AvBadge' })

    expect(badge.props('color')).toBe('var(--dark-background-success)')
    expect(badge.props('backgroundColor')).toBe('var(--light-background-success)')
  })

  BddTest().then('it should use small size', () => {
    const badge = wrapper.findComponent({ name: 'AvBadge' })
    expect(badge.props('small')).toBe(true)
  })
})
