import AvTab from '@/ui/interaction/tabs/AvTab/AvTab.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { expect } from 'vitest'

BddTest().given('an AvTab', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvTab>>

  const slots = {
    default: '<div class="slot-content">Slot Content</div>',
  }

  BddTest().and('with required props', () => {
    beforeEach(() => {
      wrapper = mount(AvTab, {
        props: {
          title: 'Test Title',
        },
        slots,
      })
    })

    BddTest().when('the tab is mounted', () => {
      BddTest().then('it should render the slot content', () => {
        expect(wrapper.find('.slot-content').exists()).toBe(true)
        expect(wrapper.find('.slot-content').text()).toBe('Slot Content')
      })
    })
  })

  BddTest().and('with optional icon prop', () => {
    let wrapper: VueWrapper
    const props = {
      title: 'Test Title',
      icon: 'test-icon',
    }

    beforeEach(() => {
      wrapper = mount(AvTab, {
        props,
        slots,
      })
    })

    BddTest().when('the tab is mounted', () => {
      BddTest().then('it should accept the icon prop without error', () => {
        expect(wrapper.props()).toMatchObject(props)
      })
    })
  })
})
