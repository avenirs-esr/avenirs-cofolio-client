import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AvDrawer from './AvDrawer.vue'

describe('avDrawer', () => {
  describe('given a drawer component', () => {
    let wrapper: ReturnType<typeof mount<typeof AvDrawer>>

    beforeEach(() => {
      wrapper = mount(AvDrawer, {
        props: {
          show: true,
        },
      })
    })

    describe('when the drawer is mounted with default props', () => {
      it('then it should render the drawer', () => {
        expect(wrapper.find('.av-drawer').exists()).toBe(true)
      })

      it('then it should have right position by default', () => {
        expect(wrapper.find('.av-drawer--right').exists()).toBe(true)
      })

      it('then it should show backdrop by default', () => {
        expect(wrapper.find('.av-drawer-backdrop').exists()).toBe(true)
      })

      it('then it should render the drawer content', () => {
        expect(wrapper.find('.av-drawer__content').exists()).toBe(true)
      })
    })

    describe('when the drawer is closed', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: false,
          },
        })
      })

      it('then it should not render the drawer', () => {
        expect(wrapper.find('.av-drawer').exists()).toBe(false)
      })

      it('then it should not render the backdrop', () => {
        expect(wrapper.find('.av-drawer-backdrop').exists()).toBe(false)
      })
    })

    describe('when the drawer has left position', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: true,
            position: 'left',
          },
        })
      })

      it('then it should have left position class', () => {
        expect(wrapper.find('.av-drawer--left').exists()).toBe(true)
      })

      it('then it should not have right position class', () => {
        expect(wrapper.find('.av-drawer--right').exists()).toBe(false)
      })
    })

    describe('when the drawer has custom width', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: true,
            width: '31.25rem',
          },
        })
      })

      it('then it should render the drawer with custom width prop', () => {
        expect(wrapper.find('.av-drawer').exists()).toBe(true)
        expect(wrapper.vm.width).toBe('31.25rem')
      })
    })

    describe('when the drawer has custom padding', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: true,
            padding: '2rem',
          },
        })
      })

      it('then it should render the drawer with custom padding prop', () => {
        expect(wrapper.find('.av-drawer__content').exists()).toBe(true)
        expect(wrapper.vm.padding).toBe('2rem')
      })
    })

    describe('when backdrop is disabled', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: true,
            backdrop: false,
          },
        })
      })

      it('then it should not render the backdrop', () => {
        expect(wrapper.find('.av-drawer-backdrop').exists()).toBe(false)
      })

      it('then it should still render the drawer', () => {
        expect(wrapper.find('.av-drawer').exists()).toBe(true)
      })
    })

    describe('when backdrop is enabled', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: true,
            backdrop: true,
          },
        })
      })

      it('then it should render the backdrop', () => {
        expect(wrapper.find('.av-drawer-backdrop').exists()).toBe(true)
      })
    })

    describe('when slot content is provided', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: true,
          },
          slots: {
            default: '<div class="test-content">Test Content</div>',
          },
        })
      })

      it('then it should render the slot content', () => {
        expect(wrapper.find('.test-content').exists()).toBe(true)
        expect(wrapper.find('.test-content').text()).toBe('Test Content')
      })
    })

    describe('when footer slot content is provided', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: true,
          },
          slots: {
            footer: '<div class="test-content">Test Content</div>',
          },
        })
      })

      it('then it should render the slot content', () => {
        expect(wrapper.find('.test-content').exists()).toBe(true)
        expect(wrapper.find('.test-content').text()).toBe('Test Content')
      })
    })

    describe('when all props are provided', () => {
      beforeEach(() => {
        wrapper = mount(AvDrawer, {
          props: {
            show: true,
            position: 'left',
            width: '25rem',
            backdrop: false,
            padding: '1rem',
          },
        })
      })

      it('then it should apply all props correctly', () => {
        expect(wrapper.find('.av-drawer--left').exists()).toBe(true)
        expect(wrapper.find('.av-drawer-backdrop').exists()).toBe(false)
        expect(wrapper.find('.av-drawer').exists()).toBe(true)
        expect(wrapper.find('.av-drawer__content').exists()).toBe(true)
        expect(wrapper.vm.width).toBe('25rem')
        expect(wrapper.vm.padding).toBe('1rem')
        expect(wrapper.vm.position).toBe('left')
        expect(wrapper.vm.backdrop).toBe(false)
      })
    })
  })
})
