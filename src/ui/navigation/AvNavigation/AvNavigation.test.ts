import AvNavigation from '@/ui/navigation/AvNavigation/AvNavigation.vue'
import { type DsfrNavigationProps, registerNavigationLinkKey } from '@gouvminint/vue-dsfr'
import { mountWithRouter } from 'tests/utils'
import { describe, expect, it, vi } from 'vitest'

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
      global: {
        provide: {
          [registerNavigationLinkKey]: vi.fn()
        },
        stubs: {
          DsfrNavigation: {
            name: 'DsfrNavigation',
            props: {
              navItems: Array<DsfrNavigationProps['navItems']>,
            },
            template: '<nav class="dsfr-navigation-mock"><slot /></nav>',
          },
        }
      }
    })

    const navWrapper = wrapper.find('.my-nav-wrapper')
    expect(navWrapper.exists()).toBe(true)

    const dsfrNav = wrapper.findComponent({ name: 'DsfrNavigation' })
    expect(wrapper.find('.dsfr-navigation-mock').exists()).toBe(true)
    expect(dsfrNav.exists()).toBe(true)

    expect(dsfrNav.props('navItems')).toEqual(props.navItems)
  })
})
