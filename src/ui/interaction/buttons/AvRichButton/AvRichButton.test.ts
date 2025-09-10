import { AvVIconStub } from '@/ui/base/AvVIcon/AvVIcon.stub'
import AvRichButton from '@/ui/interaction/buttons/AvRichButton/AvRichButton.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an AvRichButton', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvRichButton>>

  const props = { label: 'test' }

  const stubs = { AvVIcon: AvVIconStub }

  BddTest().when('mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(AvRichButton, { props, global: { stubs } })
    })

    BddTest().then('it should render an empty button', () => {
      expect(wrapper.findAllComponents({ name: 'AvVICon' })).toHaveLength(0)
    })
  })

  BddTest().when('mounted with a default slot', () => {
    beforeEach(() => {
      wrapper = mount(AvRichButton, {
        props,
        slots: { default: 'Click me' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the default slot', () => {
      expect(wrapper.text()).toContain('Click me')
    })
  })

  BddTest().when('mounted with a left icon', () => {
    const customProps = {
      ...props,
      iconLeft: 'mdi:home'
    }

    beforeEach(() => {
      wrapper = mount(AvRichButton, { props: customProps, global: { stubs } })
    })

    BddTest().then('it should render the left icon', () => {
      const leftContainer = wrapper.find('.av-rich-button__left')
      const leftIcon = leftContainer.findComponent({ name: 'AvVIcon' })
      expect(leftIcon.exists()).toBe(true)
      expect(leftIcon.props('name')).toBe(customProps.iconLeft)
    })
  })

  BddTest().when('mounted with right icon', () => {
    const customProps = {
      ...props,
      iconRight: 'mdi:home'
    }

    beforeEach(() => {
      wrapper = mount(AvRichButton, { props: customProps, global: { stubs } })
    })

    BddTest().then('it should render the left icon', () => {
      const leftContainer = wrapper.find('.av-rich-button__left')
      const leftIcon = leftContainer.findComponent({ name: 'AvVIcon' })
      expect(leftIcon.exists()).toBe(false)
      const rightIcon = wrapper.findComponent({ name: 'AvVIcon' })
      expect(rightIcon.props('name')).toBe(customProps.iconRight)
    })
  })

  BddTest().when('mounted with onClick and the button is clicked', () => {
    const onClick = vi.fn()

    const customProps = {
      ...props,
      onClick
    }

    beforeEach(() => {
      wrapper = mount(AvRichButton, { props: customProps, global: { stubs } })
    })

    BddTest().then('it should call onClick', async () => {
      await wrapper.find('button').trigger('click')
      expect(onClick).toHaveBeenCalled()
    })
  })
})
