import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import ValorizeToggle from '@/features/student/global/components/interaction/toggles/ValorizeToggle/ValorizeToggle.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a valorize toggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizeToggle>>

  const stubs = {
    Toggle: ToggleStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(ValorizeToggle, {
      props: {
        id: 'valorize-toggle',
        name: 'valorize-toggle',
        modelValue: false,
      },
      global: {
        stubs,
      },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the Toggle component', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.exists()).toBe(true)
    })

    BddTest().then('it should have the default active text', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('activeText')).toBe('Je valorise dans mon kit')
    })

    BddTest().then('it should have the default inactive text', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('inactiveText')).toBe('Je ne valorise pas dans mon kit')
    })

    BddTest().then('it should pass through id prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('id')).toBe('valorize-toggle')
    })

    BddTest().then('it should pass through name prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('name')).toBe('valorize-toggle')
    })

    BddTest().then('it should pass through modelValue prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('modelValue')).toBe(false)
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
