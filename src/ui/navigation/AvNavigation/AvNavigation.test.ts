import type { DsfrNavigationProps } from '@gouvminint/vue-dsfr'
import { mountWithRouter } from 'tests/utils'
import { describe, expect, it, vi } from 'vitest'
import AvNavigation from './AvNavigation.vue'

vi.mock('vue-dsfr', () => ({
  DsfrNavigation: {
    name: 'DsfrNavigation',
    props: {
      navItems: Array<DsfrNavigationProps['navItems']>,
    },
    template: '<nav class="dsfr-navigation-mock"><slot /></nav>',
  },
}))

describe('avNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render and pass props to DsfrNavigation', async () => {
    const props = {
      navItems: [
        { to: '/student', text: 'Home student' },
        { to: '/teacher', text: 'Home teacher' },
      ],
    }

    const wrapper = await mountWithRouter(AvNavigation, {
      props,
    })

    const navWrapper = wrapper.find('.my-nav-wrapper')
    expect(navWrapper.exists()).toBe(true)

    const dsfrNav = wrapper.findComponent({ name: 'DsfrNavigation' })
    expect(dsfrNav.exists()).toBe(true)

    expect(dsfrNav.props('navItems')).toEqual(props.navItems)
  })
})
