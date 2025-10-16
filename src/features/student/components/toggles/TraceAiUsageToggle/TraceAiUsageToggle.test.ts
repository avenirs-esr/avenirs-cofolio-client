import TraceAiUsageToggle from '@/features/student/components/toggles/TraceAiUsageToggle/TraceAiUsageToggle.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a trace AI usage toggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAiUsageToggle>>

  const stubs = {
    AvToggle: {
      name: 'AvToggle',
      props: ['id', 'name', 'modelValue', 'description', 'activeText', 'inactiveText'],
      emits: ['update:modelValue'],
      template: '<div class="av-toggle"><input type="checkbox" :id="id" :name="name" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" /><span class="description">{{ description }}</span><span class="active-text">{{ activeText }}</span><span class="inactive-text">{{ inactiveText }}</span></div>'
    }
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
    BddTest().then('it should render the AvToggle component', () => {
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
      expect(toggle.exists()).toBe(true)
    })

    BddTest().then('it should have the default description from i18n', () => {
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
      expect(toggle.props('description')).toBe('Je soumets une production réalisée avec IA')
    })

    BddTest().then('it should have the default active text from i18n', () => {
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
      expect(toggle.props('activeText')).toBe('Oui')
    })

    BddTest().then('it should have the default inactive text from i18n', () => {
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
      expect(toggle.props('inactiveText')).toBe('Non')
    })

    BddTest().then('it should pass through id prop', () => {
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
      expect(toggle.props('id')).toBe('ai-usage')
    })

    BddTest().then('it should pass through name prop', () => {
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
      expect(toggle.props('name')).toBe('ai-usage')
    })

    BddTest().then('it should pass through modelValue prop', () => {
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
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
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
      expect(toggle.props('description')).toBe('Custom description')
    })
  })

  BddTest().when('the toggle checkbox is changed', () => {
    BddTest().then('it should emit update:modelValue event', async () => {
      const toggle = wrapper.findComponent({ name: 'AvToggle' })
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

      const toggle = wrapper.findComponent({ name: 'AvToggle' })
      expect(toggle.props('modelValue')).toBe(true)
    })
  })
})
