import type { VueWrapper } from '@vue/test-utils'
import { ETraceAuthorType } from '@/api/avenir-esr'
import TraceAuthorTypeRadioSet from '@/features/traces/components/interactions/radios/TraceAuthorTypeRadioSet/TraceAuthorTypeRadioSet.vue'
import { AvRadioButtonSetStub, AvRadioButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvRadioButtonSet: AvRadioButtonSetStub,
  AvRadioButton: AvRadioButtonStub
}

BddTest().given('a trace author type radio set component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAuthorTypeRadioSet>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(TraceAuthorTypeRadioSet, {
      props: { modelValue: null },
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the container', () => {
      expect(wrapper.find('[data-testid="trace-author-type-radio-set"]').exists()).toBe(true)
    })

    BddTest().then('it should render AvRadioButtonSet', () => {
      expect(wrapper.findComponent({ name: 'AvRadioButtonSet' }).exists()).toBe(true)
    })

    BddTest().then('it should render 3 radio buttons', () => {
      const buttons = wrapper.findAllComponents({ name: 'AvRadioButton' })
      expect(buttons).toHaveLength(3)
    })

    BddTest().then('it should render PERSONAL, COLLECTIVE, THIRD_PARTY in order', () => {
      const buttons = wrapper.findAllComponents({ name: 'AvRadioButton' })
      expect(buttons[0].props('value')).toBe(ETraceAuthorType.PERSONAL)
      expect(buttons[1].props('value')).toBe(ETraceAuthorType.COLLECTIVE)
      expect(buttons[2].props('value')).toBe(ETraceAuthorType.THIRD_PARTY)
    })
  })

  BddTest().when('an error message is provided', () => {
    BddTest().then('it should pass it to AvRadioButtonSet', async () => {
      await wrapper.setProps({ errorMessage: 'Ce champ est requis.' })
      const radioSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioSet.props('errorMessage')).toBe('Ce champ est requis.')
    })
  })

  BddTest().when('a valid value is emitted', () => {
    BddTest().then('it should update modelValue', async () => {
      const radioSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      await radioSet.vm.$emit('update:modelValue', ETraceAuthorType.PERSONAL)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe(ETraceAuthorType.PERSONAL)
    })
  })

  BddTest().when('modelValue is COLLECTIVE', () => {
    BddTest().then('it should pass it to AvRadioButtonSet', async () => {
      await wrapper.setProps({ modelValue: ETraceAuthorType.COLLECTIVE })
      const radioSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioSet.props('modelValue')).toBe(ETraceAuthorType.COLLECTIVE)
    })
  })

  BddTest().when('modelValue is null', () => {
    BddTest().then('it should pass undefined to AvRadioButtonSet', () => {
      const radioSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioSet.props('modelValue')).toBeUndefined()
    })
  })
})
