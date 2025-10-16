import { ToggleStub } from '@/common/components'
import TraceGroupProductionToggle from '@/features/student/components/toggles/TraceGroupProductionToggle/TraceGroupProductionToggle.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a trace group production toggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceGroupProductionToggle>>

  const stubs = {
    Toggle: ToggleStub
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TraceGroupProductionToggle, {
      props: {
        id: 'group',
        name: 'group',
        modelValue: false
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the Toggle component', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.exists()).toBe(true)
    })

    BddTest().then('it should have the default description from i18n', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('description')).toBe('Je soumets une production de groupe')
    })

    BddTest().then('it should pass through id prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('id')).toBe('group')
    })

    BddTest().then('it should pass through name prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('name')).toBe('group')
    })

    BddTest().then('it should pass through modelValue prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('modelValue')).toBe(false)
    })
  })

  BddTest().when('custom description prop is provided', () => {
    beforeEach(() => {
      wrapper = mount(TraceGroupProductionToggle, {
        props: {
          id: 'group',
          name: 'group',
          modelValue: false,
          description: 'Custom description'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should use the custom description', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('description')).toBe('Custom description')
    })
  })

  BddTest().when('the toggle checkbox is changed', () => {
    BddTest().then('it should emit update:modelValue event', async () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      expect(toggle.emitted('update:modelValue')).toBeTruthy()
      expect(toggle.emitted('update:modelValue')?.[0]).toEqual([true])
    })
  })

  BddTest().when('modelValue prop changes', () => {
    BddTest().then('it should update the toggle state', async () => {
      await wrapper.setProps({ modelValue: true })
      await wrapper.vm.$nextTick()

      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('modelValue')).toBe(true)
    })
  })
})
