import type { DsfrNavigationProps } from '@gouvminint/vue-dsfr'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import AvNavigation from './AvNavigation.vue'

// Mock ciblé du composant DsfrNavigation de vue-dsfr
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
  it('should render and pass props to DsfrNavigation', () => {
    const props = {
      navItems: [
        { to: '/home', text: 'Home' },
        { to: '/about', text: 'About' },
      ],
    }

    const wrapper = mount(AvNavigation, {
      props,
    })

    const navWrapper = wrapper.find('.my-nav-wrapper')
    expect(navWrapper.exists()).toBe(true)

    const dsfrNav = wrapper.findComponent({ name: 'DsfrNavigation' })
    expect(dsfrNav.exists()).toBe(true)

    expect(dsfrNav.props('navItems')).toEqual(props.navItems)
  })
})
