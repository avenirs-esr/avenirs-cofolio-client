import AvList from '@/ui/interaction/lists/AvList/AvList.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an AvList component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvList>>

  const stubs = {
    AvListItem: {
      name: 'AvListItem',
      props: ['title', 'subtitle', 'icon'],
      template: '<div class="av-list-item"><slot /></div>'
    }
  }

  beforeEach(() => {
    wrapper = mount(AvList, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render with default props', () => {
      expect(wrapper.find('.av-list').exists()).toBe(true)
      expect(wrapper.attributes('role')).toBe('list')
      expect(wrapper.classes()).toContain('av-list--small')
    })

    BddTest().then('it should have correct default styling', () => {
      const listElement = wrapper.find('.av-list')
      expect(listElement.exists()).toBe(true)
      expect(listElement.classes()).not.toContain('av-list--bordered')
      expect(listElement.classes()).not.toContain('av-list--divided')
    })

    BddTest().then('it should render slot content', () => {
      const wrapperWithSlot = mount(AvList, {
        slots: {
          default: '<div class="test-content">Test Content</div>'
        }
      })

      expect(wrapperWithSlot.find('.test-content').exists()).toBe(true)
      expect(wrapperWithSlot.find('.test-content').text()).toBe('Test Content')
    })
  })

  BddTest().when('size prop is provided', () => {
    BddTest().then('it should apply xsmall size class', async () => {
      await wrapper.setProps({ size: 'xsmall' })
      expect(wrapper.classes()).toContain('av-list--xsmall')
    })

    BddTest().then('it should apply small size class', async () => {
      await wrapper.setProps({ size: 'small' })
      expect(wrapper.classes()).toContain('av-list--small')
    })

    BddTest().then('it should apply medium size class', async () => {
      await wrapper.setProps({ size: 'medium' })
      expect(wrapper.classes()).toContain('av-list--medium')
    })

    BddTest().then('it should apply large size class', async () => {
      await wrapper.setProps({ size: 'large' })
      expect(wrapper.classes()).toContain('av-list--large')
    })
  })

  BddTest().when('bordered prop is true', () => {
    beforeEach(async () => {
      await wrapper.setProps({ bordered: true })
    })

    BddTest().then('it should apply bordered class', () => {
      expect(wrapper.classes()).toContain('av-list--bordered')
    })
  })

  BddTest().when('divided prop is true', () => {
    beforeEach(async () => {
      await wrapper.setProps({ divided: true })
    })

    BddTest().then('it should apply divided class', () => {
      expect(wrapper.classes()).toContain('av-list--divided')
    })
  })

  BddTest().when('custom styling props are provided', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        backgroundColor: '#f0f0f0',
        borderColor: '#cccccc',
        borderRadius: '8px',
        padding: '16px'
      })
    })

    BddTest().then('it should accept custom styling props', () => {
      // Test that the component accepts the props without error
      expect(wrapper.props('backgroundColor')).toBe('#f0f0f0')
      expect(wrapper.props('borderColor')).toBe('#cccccc')
      expect(wrapper.props('borderRadius')).toBe('8px')
      expect(wrapper.props('padding')).toBe('16px')
    })

    BddTest().then('it should still render correctly with custom styles', () => {
      const listElement = wrapper.find('.av-list')
      expect(listElement.exists()).toBe(true)
      expect(wrapper.attributes('role')).toBe('list')
    })
  })

  BddTest().when('accessibility props are provided', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        role: 'menu',
        ariaLabel: 'Navigation menu',
        ariaLabelledby: 'menu-title',
        ariaDescribedby: 'menu-description'
      })
    })

    BddTest().then('it should apply custom role', () => {
      expect(wrapper.attributes('role')).toBe('menu')
    })

    BddTest().then('it should apply aria-label', () => {
      expect(wrapper.attributes('aria-label')).toBe('Navigation menu')
    })

    BddTest().then('it should apply aria-labelledby', () => {
      expect(wrapper.attributes('aria-labelledby')).toBe('menu-title')
    })

    BddTest().then('it should apply aria-describedby', () => {
      expect(wrapper.attributes('aria-describedby')).toBe('menu-description')
    })
  })

  BddTest().when('multiple style modifiers are combined', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        size: 'large',
        bordered: true,
        divided: true
      })
    })

    BddTest().then('it should apply all modifier classes', () => {
      expect(wrapper.classes()).toContain('av-list--large')
      expect(wrapper.classes()).toContain('av-list--bordered')
      expect(wrapper.classes()).toContain('av-list--divided')
    })
  })

  BddTest().when('rendering with list items', () => {
    beforeEach(() => {
      wrapper = mount(AvList, {
        props: {
          divided: true,
          size: 'medium'
        },
        slots: {
          default: `
              <AvListItem title="Item 1" />
              <AvListItem title="Item 2" />
              <AvListItem title="Item 3" />
            `
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render all list items', () => {
      const listItems = wrapper.findAllComponents({ name: 'AvListItem' })
      expect(listItems).toHaveLength(3)
    })

    BddTest().then('it should maintain list structure', () => {
      expect(wrapper.find('.av-list').exists()).toBe(true)
      expect(wrapper.classes()).toContain('av-list--medium')
      expect(wrapper.classes()).toContain('av-list--divided')
    })
  })
})
