import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import TraceNameInput from '@/features/traces/components/interactions/inputs/TraceNameInput/TraceNameInput.vue'
import { TRACE_NAME_MAX_LENGTH } from '@/features/traces/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  Input: InputStub
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
    BddTest().then('it should render Input with default props', () => {
      const input = wrapper.findComponent(InputStub)

      expect(input.exists()).toBe(true)
      expect(input.props('label')).toBe('Nom de ma trace')
      expect(input.props('placeholder')).toBe('Nom-de-ma-trace-01')
      expect(input.props('maxlength')).toBe(TRACE_NAME_MAX_LENGTH)
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.ATTACH_FILE)
      expect(input.props('isTextarea')).toBe(false)
      expect(input.props('labelVisible')).toBe(true)
      expect(input.props('disabled')).toBe(false)
      expect(input.props('required')).toBe(true)
    })

    BddTest().then('it should render character count hint', () => {
      const hint = wrapper.find('[data-testid="maxlength-caption"]')

      expect(hint.exists()).toBe(true)
      expect(hint.text()).toBe(`0 / ${TRACE_NAME_MAX_LENGTH} caractères (espaces compris)`)
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

      const input = wrapper.findComponent(InputStub)

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

      const input = wrapper.findComponent(InputStub)

      expect(input.props('placeholder')).toBe('Custom placeholder text')
    })
  })

  BddTest().when('custom maxlength is provided', () => {
    BddTest().then('it should use the custom maxlength', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          maxlength: 200
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent(InputStub)

      expect(input.props('maxlength')).toBe(200)
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

      const input = wrapper.findComponent(InputStub)

      expect(input.props('prefixIcon')).toBe(MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE)
    })
  })

  BddTest().when('the component is disabled', () => {
    BddTest().then('it should pass disabled state to Input', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          disabled: true
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent(InputStub)

      expect(input.props('disabled')).toBe(true)
    })
  })

  BddTest().when('required is false', () => {
    BddTest().then('it should pass required state to Input', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          required: false
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent(InputStub)

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

      const input = wrapper.findComponent(InputStub)

      expect(input.props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('isValid is true', () => {
    BddTest().then('it should pass valid state to Input', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          isValid: true
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent(InputStub)

      expect(input.props('isValid')).toBe(true)
    })
  })

  BddTest().when('text is entered', () => {
    BddTest().then('it should update the model value', async () => {
      const input = wrapper.findComponent(InputStub)
      await input.vm.$emit('update:modelValue', 'My trace name')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['My trace name'])
    })

    BddTest().then('it should update the character count hint', async () => {
      wrapper = mount(TraceNameInput, {
        props: {
          modelValue: 'Du texte ici'
        },
        global: {
          stubs
        }
      })

      const hint = wrapper.find('[data-testid="maxlength-caption"]')

      expect(hint.text()).toBe(`12 / ${TRACE_NAME_MAX_LENGTH} caractères (espaces compris)`)
    })
  })

  BddTest().when('a value is provided via v-model', () => {
    BddTest().then('it should pass the value to Input', () => {
      const testValue = 'Test trace name'

      wrapper = mount(TraceNameInput, {
        props: {
          modelValue: testValue
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent(InputStub)

      expect(input.props('modelValue')).toBe(testValue)
    })
  })

  BddTest().when('errorMessage is provided', () => {
    BddTest().then('it should pass the error message to Input', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          errorMessage: 'Ce champ est requis'
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent(InputStub)

      expect(input.props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('isTextarea is true', () => {
    BddTest().then('it should pass textarea state to Input', () => {
      wrapper = mount(TraceNameInput, {
        props: {
          isTextarea: true
        },
        global: {
          stubs
        }
      })

      const input = wrapper.findComponent(InputStub)

      expect(input.props('isTextarea')).toBe(true)
    })
  })

  BddTest().when('the character count reaches maximum', () => {
    BddTest().then('it should display the correct count in hint', () => {
      const maxText = 'a'.repeat(TRACE_NAME_MAX_LENGTH)

      wrapper = mount(TraceNameInput, {
        props: {
          modelValue: maxText
        },
        global: {
          stubs
        }
      })

      const hint = wrapper.find('[data-testid="maxlength-caption"]')

      expect(hint.text()).toBe(`${TRACE_NAME_MAX_LENGTH} / ${TRACE_NAME_MAX_LENGTH} caractères (espaces compris)`)
    })
  })
})
