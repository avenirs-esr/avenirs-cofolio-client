import type { VueWrapper } from '@vue/test-utils'
import AvNavigation from '@/ui/navigation/AvNavigation/AvNavigation.vue'
import { mountWithRouter } from '@/ui/tests/utils'
import { registerNavigationLinkKey } from '@gouvminint/vue-dsfr'
import { DsfrNavigationStub } from 'tests/stubs'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an AvNavigation', () => {
  let wrapper: VueWrapper

  const props = {
    navItems: [
      { to: '/student', text: 'Home student' },
      { to: '/teacher', text: 'Home teacher' },
    ],
  }

  const stubs = { DsfrNavigation: DsfrNavigationStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      wrapper = await mountWithRouter(AvNavigation, {
        props,
        global: {
          provide: { [registerNavigationLinkKey]: vi.fn() },
          stubs
        }
      })
    })

    BddTest().then('it should render and pass props to DsfrNavigation', async () => {
      const navWrapper = wrapper.find('.my-nav-wrapper')
      expect(navWrapper.exists()).toBe(true)

      const dsfrNav = wrapper.findComponent({ name: 'DsfrNavigation' })
      expect(wrapper.find('.dsfr-navigation-mock').exists()).toBe(true)
      expect(dsfrNav.exists()).toBe(true)

      expect(dsfrNav.props('navItems')).toEqual(props.navItems)
    })
  })
})
