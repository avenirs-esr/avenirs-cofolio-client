import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import TraceNameInput from './TraceNameInput.vue'

const AvInputStub = {
  name: 'AvInput',
  props: ['modelValue', 'label', 'placeholder', 'prefixIcon', 'isValid', 'isTextarea', 'labelVisible', 'disabled', 'required', 'errorMessage'],
  emits: ['update:modelValue'],
  template: `
    <div>
      <label v-if="labelVisible">{{ label }}</label>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  `
}

const stubs = {
  AvInput: AvInputStub
}

BddTest().given('a trace name input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceNameInput>>

  beforeEach(() => {
    wrapper = mount(TraceNameInput, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render AvInput with default props', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.exists()).toBe(true)
      expect(input.props('label')).toBe('Nom de ma trace')
      expect(input.props('placeholder')).toBe('Nom-de-ma-trace-01')
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.ATTACH_FILE)
      expect(input.props('isTextarea')).toBe(false)
      expect(input.props('labelVisible')).toBe(true)
      expect(input.props('disabled')).toBe(false)
      expect(input.props('required')).toBe(true)
    })
  })

  BddTest().when('custom label is provided', () => {
    BddTest().then('it should use the custom label', () => {
      wrapper = mount(TraceNameInput, {
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
      wrapper = mount(TraceNameInput, {
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

  BddTest().when('custom prefixIcon is provided', () => {
    BddTest().then('it should use the custom prefixIcon', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          prefixIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('prefixIcon')).toBe(MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE)
    })
  })

  BddTest().when('the component is disabled', () => {
    BddTest().then('it should pass disabled state to AvInput', () => {
      wrapper = mount(TraceNameInput, {
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

  BddTest().when('required is false', () => {
    BddTest().then('it should pass required state to AvInput', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          required: false
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('required')).toBe(false)
    })
  })

  BddTest().when('labelVisible is false', () => {
    BddTest().then('it should hide the label', () => {
      wrapper = mount(TraceNameInput, {
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
      wrapper = mount(TraceNameInput, {
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
      await input.vm.$emit('update:modelValue', 'My trace name')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['My trace name'])
    })
  })

  BddTest().when('a value is provided via v-model', () => {
    BddTest().then('it should pass the value to AvInput', () => {
      const testValue = 'Test trace name'

      wrapper = mount(TraceNameInput, {
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
      wrapper = mount(TraceNameInput, {
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

  BddTest().when('isTextarea is true', () => {
    BddTest().then('it should pass textarea state to AvInput', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          isTextarea: true
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('isTextarea')).toBe(true)
    })
  })
})
