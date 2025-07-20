import AvSideMenu from '@/ui/navigation/AvSideMenu/AvSideMenu.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('avSideMenu', () => {
  describe('given an AvSideMenu component', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu)
    })

    describe('when the component is mounted with default props', () => {
      it('then it should render the side-menu navigation element', () => {
        expect(wrapper.find('nav.av-side-menu').exists()).toBe(true)
      })

      it('then it should render the header with toggle button by default (collapsible=true)', () => {
        expect(wrapper.find('.av-side-menu__header').exists()).toBe(true)
        expect(wrapper.find('.av-side-menu__collapse-button').exists()).toBe(true)
      })

      it('then it should not be collapsed by default', () => {
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })

      it('then it should be collapsible by default', () => {
        const button = wrapper.find('.av-side-menu__collapse-button')
        expect(button.exists()).toBe(true)
      })
    })
  })

  describe('given an AvSideMenu component with collapsible=false', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          collapsible: false
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should not render the header or toggle button', () => {
        expect(wrapper.find('.av-side-menu__header').exists()).toBe(false)
        expect(wrapper.find('.av-side-menu__collapse-button').exists()).toBe(false)
      })

      it('then it should never have collapsed class', () => {
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })

      it('then it should always use the expanded width', () => {
        const sideMenu = wrapper.find('.av-side-menu')
        expect(sideMenu.exists()).toBe(true)
        // When collapsible=false, the component should never be collapsed
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })
    })
  })

  describe('given an AvSideMenu component with custom id', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          id: 'custom-side-menu'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should use the provided id', () => {
        const nav = wrapper.find('nav')
        expect(nav.attributes('id')).toBe('custom-side-menu')
      })

      it('then it should set the aria-label based on id', () => {
        const nav = wrapper.find('nav')
        expect(nav.attributes('aria-label')).toBe('custom-side-menu navigation')
      })

      it('then it should set aria-controls on toggle button', () => {
        const button = wrapper.find('.av-side-menu__collapse-button')
        expect(button.attributes('aria-controls')).toBe('custom-side-menu')
      })
    })
  })

  describe('given an AvSideMenu component with collapsed state', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          collapsed: true,
          id: 'test-menu'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should have collapsed class', () => {
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(true)
      })

      it('then it should set aria-expanded to false', () => {
        const button = wrapper.find('.av-side-menu__collapse-button')
        expect(button.attributes('aria-expanded')).toBe('false')
      })

      it('then it should use collapsed width', () => {
        const sideMenu = wrapper.find('.av-side-menu')
        expect(sideMenu.exists()).toBe(true)
        // When collapsed=true, the component should have the collapsed class
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(true)
      })
    })
  })

  describe('given an AvSideMenu component with custom width', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          width: '20rem',
          collapsedWidth: '3rem'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should apply the custom width', () => {
        const sideMenu = wrapper.find('.av-side-menu')
        expect(sideMenu.exists()).toBe(true)
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })
    })

    describe('when the component is collapsed', () => {
      it('then it should apply the collapsed width', async () => {
        await wrapper.setProps({ collapsed: true })
        const sideMenu = wrapper.find('.av-side-menu')
        expect(sideMenu.exists()).toBe(true)
        // When collapsed=true is set, component should have collapsed class
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(true)
      })
    })
  })

  describe('given an AvSideMenu component with toggle functionality and defineModel', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          id: 'test-menu'
        }
      })
    })

    describe('when the toggle button is clicked', () => {
      it('then it should emit update:collapsed event with defineModel', async () => {
        const button = wrapper.find('.av-side-menu__collapse-button')
        await button.trigger('click')

        expect(wrapper.emitted('update:collapsed')).toBeTruthy()
        expect(wrapper.emitted('update:collapsed')![0]).toEqual([true])
      })

      it('then it should toggle the state', async () => {
        const button = wrapper.find('.av-side-menu__collapse-button')

        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)

        await button.trigger('click')
        await wrapper.vm.$nextTick()

        // defineModel always emits events
        expect(wrapper.emitted('update:collapsed')).toBeTruthy()
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(true)
      })
    })
  })

  describe('given an AvSideMenu component with non-collapsible and collapsed props', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          collapsible: false,
          collapsed: true // Should be ignored when collapsible=false
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should ignore collapsed prop when collapsible=false', () => {
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })

      it('then it should not emit events when toggle is called programmatically', async () => {
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })
    })
  })

  describe('given an AvSideMenu component with defineModel (uncontrolled)', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          id: 'uncontrolled-menu'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should start with default collapsed state (false)', () => {
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })

      it('then it should toggle internal state when button is clicked', async () => {
        const button = wrapper.find('.av-side-menu__collapse-button')

        // Should be expanded initially
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)

        // Click to collapse
        await button.trigger('click')
        await wrapper.vm.$nextTick()

        // Should change state directly with defineModel
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(true)

        // Click again to expand
        await button.trigger('click')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })
    })
  })

  describe('given an AvSideMenu component with v-model (controlled)', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          'collapsed': false,
          'update:collapsed': (value: boolean) => wrapper.setProps({ collapsed: value }),
          'id': 'controlled-menu'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should use collapsed prop value', () => {
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)
      })

      it('then it should emit events when toggle is called', async () => {
        const button = wrapper.find('.av-side-menu__collapse-button')

        await button.trigger('click')

        expect(wrapper.emitted('update:collapsed')).toBeTruthy()
        expect(wrapper.emitted('update:collapsed')![0]).toEqual([true])
      })

      it('then it should update when collapsed prop changes', async () => {
        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(false)

        await wrapper.setProps({ collapsed: true })

        expect(wrapper.find('.av-side-menu--collapsed').exists()).toBe(true)
      })
    })
  })

  describe('given an AvSideMenu component with default slot content', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        slots: {
          default: '<div class="custom-content">Menu Content</div>'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the slot content', () => {
        const content = wrapper.find('.custom-content')
        expect(content.exists()).toBe(true)
        expect(content.text()).toBe('Menu Content')
      })

      it('then it should render the content inside av-side-menu__content', () => {
        const contentWrapper = wrapper.find('.av-side-menu__content')
        expect(contentWrapper.exists()).toBe(true)
        expect(contentWrapper.find('.custom-content').exists()).toBe(true)
      })
    })
  })

  describe('given an AvSideMenu component with accessibility', () => {
    let wrapper: ReturnType<typeof mount<typeof AvSideMenu>>

    beforeEach(() => {
      wrapper = mount<typeof AvSideMenu>(AvSideMenu, {
        props: {
          id: 'main-nav'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should have proper ARIA attributes', () => {
        const nav = wrapper.find('nav')
        const button = wrapper.find('.av-side-menu__collapse-button')

        expect(nav.attributes('aria-label')).toBe('main-nav navigation')
        expect(button.attributes('aria-expanded')).toBe('true')
        expect(button.attributes('aria-controls')).toBe('main-nav')
      })
    })
  })
})
