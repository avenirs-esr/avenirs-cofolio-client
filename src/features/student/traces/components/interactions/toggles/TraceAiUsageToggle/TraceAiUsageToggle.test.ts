import { ToggleStub } from '@/common/components'
import TraceAiUsageToggle from '@/features/student/traces/components/interactions/toggles/TraceAiUsageToggle/TraceAiUsageToggle.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a trace AI usage toggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAiUsageToggle>>

  const stubs = {
    Toggle: ToggleStub
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TraceAiUsageToggle, {
      props: {
        id: 'ai-usage',
        name: 'ai-usage',
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
      expect(toggle.props('description')).toBe('Je soumets une production réalisée avec IA')
    })

    BddTest().then('it should pass through id prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('id')).toBe('ai-usage')
    })

    BddTest().then('it should pass through name prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('name')).toBe('ai-usage')
    })

    BddTest().then('it should pass through modelValue prop', () => {
      const toggle = wrapper.findComponent({ name: 'Toggle' })
      expect(toggle.props('modelValue')).toBe(false)
    })
  })

  BddTest().when('custom description prop is provided', () => {
    beforeEach(() => {
      wrapper = mount(TraceAiUsageToggle, {
        props: {
          id: 'ai-usage',
          name: 'ai-usage',
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
