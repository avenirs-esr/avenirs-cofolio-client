import AvRadioButton from '@/ui/interaction/radios/AvRadioButton/AvRadioButton.vue'
import AvRadioButtonSet, { type AvRadioButtonSetProps } from '@/ui/interaction/radios/AvRadioButtonSet/AvRadioButtonSet.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { h } from 'vue'

BddTest().given('a radio button set', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvRadioButtonSet>>

  const stubs = {
    DsfrRadioButton: {
      props: ['modelValue', 'value', 'disabled'],
      emits: ['update:modelValue'],
      template: `
              <label>
                <input
                  type="radio"
                  :value="value"
                  :checked="modelValue === value"
                  @change="$emit('update:modelValue', value)"
                />
                <slot name="label" />
              </label>
            `
    },
    DsfrRadioButtonSet: {
      template: `<fieldset><slot /></fieldset>`
    }
  }
  const props: AvRadioButtonSetProps = {
    name: 'Radio button set',
    modelValue: 'Radio 1'
  }
  const slots = {
    default: () => [
      h(AvRadioButton, { value: 'Radio 1' }, () => 'Choice 1'),
      h(AvRadioButton, { value: 'Radio 2' }, () => 'Choice 2'),
      h(AvRadioButton, { value: 'Radio 3' }, () => 'Choice 3'),
    ]
  }

  BddTest().and('with multiple radio buttons', () => {
    beforeEach(() => {
      wrapper = mount(AvRadioButtonSet, { props, slots, global: { stubs } })
    })

    BddTest().when('the radio button set is mounted', () => {
      BddTest().then('it should render all radio buttons', () => {
        const radios = wrapper.findAll('input[type="radio"]')
        expect(radios.length).toBe(3)
      })
    })

    BddTest().when('selecting a new radio button', () => {
      BddTest().then('it should update the selected radio button', async () => {
        const radios = wrapper.findAll('input[type="radio"]')
        await radios[1].setValue()

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Radio 2'])
      })
    })
  })

  BddTest().and('with no slot provided', () => {
    beforeEach(() => {
      wrapper = mount(AvRadioButtonSet, { props })
    })

    BddTest().when('the radio button set is mounted', () => {
      BddTest().then('it should not render any radio button', () => {
        const radios = wrapper.findAllComponents({ name: 'AvRadioButton' })
        expect(radios.length).toBe(0)
      })
    })
  })

  BddTest().and('with a modelValue change from the parent', () => {
    beforeEach(() => {
      wrapper = mount(AvRadioButtonSet, { props, slots })
    })

    BddTest().when('the parent updates modelValue', () => {
      BddTest().then('it should update the selected radio button accordingly', async () => {
        await wrapper.setProps({ modelValue: 'Radio 3' })
        expect(wrapper.vm.selected).toBe('Radio 3')
      })
    })
  })
})
