import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import TracePersonalNoteTextarea from './TracePersonalNoteTextarea.vue'

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
      <slot name="customCaptions" :current-value="modelValue" :maxlength="maxlength" />
    </div>
  `
}

const stubs = {
  AvInput: AvInputStub
}

BddTest().given('a trace personal note textarea component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TracePersonalNoteTextarea>>

  beforeEach(() => {
    wrapper = mount(TracePersonalNoteTextarea, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render AvInput with default props', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.exists()).toBe(true)
      expect(input.props('label')).toBe('Note personnelle')
      expect(input.props('placeholder')).toBe('Ajoutez votre note personnelle ici...')
      expect(input.props('maxlength')).toBe(200)
      expect(input.props('isTextarea')).toBe(true)
      expect(input.props('labelVisible')).toBe(true)
      expect(input.props('disabled')).toBe(false)
      expect(input.props('required')).toBe(false)
    })

    BddTest().then('it should render character count hint', () => {
      const hint = wrapper.find('.caption-light')

      expect(hint.exists()).toBe(true)
      expect(hint.text()).toBe('0 / 200 caractères (espaces compris)')
    })
  })

  BddTest().when('custom label is provided', () => {
    BddTest().then('it should use the custom label', () => {
      const label = 'Label personalisé'

      wrapper = mount(TracePersonalNoteTextarea, {
        props: {
          label
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('label')).toBe(label)
    })
  })

  BddTest().when('custom placeholder is provided', () => {
    BddTest().then('it should use the custom placeholder', () => {
      const placeholder = 'Placeholder personalisé'
      wrapper = mount(TracePersonalNoteTextarea, {
        props: {
          placeholder
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('placeholder')).toBe(placeholder)
    })
  })

  BddTest().when('custom maxlength is provided', () => {
    BddTest().then('it should use the custom maxlength', () => {
      wrapper = mount(TracePersonalNoteTextarea, {
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
      wrapper = mount(TracePersonalNoteTextarea, {
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
      wrapper = mount(TracePersonalNoteTextarea, {
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
      wrapper = mount(TracePersonalNoteTextarea, {
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
      wrapper = mount(TracePersonalNoteTextarea, {
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
      await input.vm.$emit('update:modelValue', 'Note personnelle de test')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Note personnelle de test'])
    })

    BddTest().then('it should update the character count hint', async () => {
      wrapper = mount(TracePersonalNoteTextarea, {
        props: {
          modelValue: 'Du texte ici'
        },
        global: {
          stubs
        }
      })

      const hint = wrapper.find('.caption-light')

      expect(hint.text()).toBe('12 / 200 caractères (espaces compris)')
    })
  })

  BddTest().when('a value is provided via v-model', () => {
    BddTest().then('it should pass the value to AvInput', () => {
      const testValue = 'Ceci est une note personnelle de test'

      wrapper = mount(TracePersonalNoteTextarea, {
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
      wrapper = mount(TracePersonalNoteTextarea, {
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
      const maxText = 'a'.repeat(200)

      wrapper = mount(TracePersonalNoteTextarea, {
        props: {
          modelValue: maxText
        },
        global: {
          stubs
        }
      })

      const hint = wrapper.find('.caption-light')

      expect(hint.text()).toBe('200 / 200 caractères (espaces compris)')
    })
  })
})
