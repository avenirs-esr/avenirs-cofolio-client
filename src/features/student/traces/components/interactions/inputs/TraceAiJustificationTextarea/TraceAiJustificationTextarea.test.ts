import TraceAiJustificationTextarea from '@/features/student/traces/components/interactions/inputs/TraceAiJustificationTextarea/TraceAiJustificationTextarea.vue'
import { TRACE_IA_JUSTIFICATION_MAX_LENGTH } from '@/features/student/traces/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const AvInputStub = {
  name: 'AvInput',
  props: ['modelValue', 'label', 'placeholder', 'maxlength', 'isTextarea', 'isValid', 'labelVisible', 'disabled', 'required', 'errorMessage'],
  emits: ['update:modelValue'],
  template: `
    <div>
      <label v-if="labelVisible">{{ label }}</label>
      <textarea
        v-if="isTextarea"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <input
        v-else
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <slot name="maxLengthCaption" :current-value="modelValue" :maxlength="maxlength" />
    </div>
  `
}

const stubs = {
  AvInput: AvInputStub
}

BddTest().given('a trace ia justification textarea component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAiJustificationTextarea>>

  beforeEach(() => {
    wrapper = mount(TraceAiJustificationTextarea, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render AvInput with default props', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.exists()).toBe(true)
      expect(input.props('label')).toBe('Justification de l\'usage de l\'IA')
      expect(input.props('placeholder')).toBe('Décrivez comment et pourquoi vous avez utilisé l\'IA...')
      expect(input.props('maxlength')).toBe(TRACE_IA_JUSTIFICATION_MAX_LENGTH)
      expect(input.props('isTextarea')).toBe(true)
      expect(input.props('labelVisible')).toBe(true)
      expect(input.props('disabled')).toBe(false)
      expect(input.props('required')).toBe(false)
    })

    BddTest().then('it should render character count hint', () => {
      const hint = wrapper.find('.caption-light')

      expect(hint.exists()).toBe(true)
      expect(hint.text()).toBe(`0 / ${TRACE_IA_JUSTIFICATION_MAX_LENGTH} caractères (espaces compris)`)
    })
  })

  BddTest().when('custom label is provided', () => {
    BddTest().then('it should use the custom label', () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          label: 'Custom Label'
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('custom placeholder is provided', () => {
    BddTest().then('it should use the custom placeholder', () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          placeholder: 'Custom placeholder text'
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('placeholder')).toBe('Custom placeholder text')
    })
  })

  BddTest().when('custom maxlength is provided', () => {
    BddTest().then('it should use the custom maxlength', () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          maxlength: 500
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('maxlength')).toBe(500)
    })
  })

  BddTest().when('the component is disabled', () => {
    BddTest().then('it should pass disabled state to AvInput', () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          disabled: true
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('disabled')).toBe(true)
    })
  })

  BddTest().when('the component is required', () => {
    BddTest().then('it should pass required state to AvInput', () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          required: true
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('required')).toBe(true)
    })
  })

  BddTest().when('labelVisible is false', () => {
    BddTest().then('it should hide the label', () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          labelVisible: false
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('isValid is true', () => {
    BddTest().then('it should pass valid state to AvInput', () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          isValid: true
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('isValid')).toBe(true)
    })
  })

  BddTest().when('text is entered', () => {
    BddTest().then('it should update the model value', async () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', 'Test justification text')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Test justification text'])
    })

    BddTest().then('it should update the character count hint', async () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          modelValue: 'Some text here'
        },
        global: {
          stubs
        }
      })

      const hint = wrapper.find('.caption-light')

      expect(hint.text()).toBe(`14 / ${TRACE_IA_JUSTIFICATION_MAX_LENGTH} caractères (espaces compris)`)
    })
  })

  BddTest().when('a value is provided via v-model', () => {
    BddTest().then('it should pass the value to AvInput', () => {
      const testValue = 'This is a test justification for AI usage'

      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          modelValue: testValue
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('modelValue')).toBe(testValue)
    })
  })

  BddTest().when('errorMessage is provided', () => {
    BddTest().then('it should pass the error message to AvInput', () => {
      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          errorMessage: 'Ce champ est requis'
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the character count reaches maximum', () => {
    BddTest().then('it should display the correct count in hint', () => {
      const maxText = 'a'.repeat(TRACE_IA_JUSTIFICATION_MAX_LENGTH)

      wrapper = mount(TraceAiJustificationTextarea, {
        props: {
          modelValue: maxText
        },
        global: {
          stubs
        }
      })

      const hint = wrapper.find('.caption-light')

      expect(hint.text()).toBe(`${TRACE_IA_JUSTIFICATION_MAX_LENGTH} / ${TRACE_IA_JUSTIFICATION_MAX_LENGTH} caractères (espaces compris)`)
    })
  })
})
