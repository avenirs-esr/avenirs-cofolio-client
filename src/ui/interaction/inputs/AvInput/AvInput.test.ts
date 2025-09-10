import AvInput from '@/ui/interaction/inputs/AvInput/AvInput.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, describe, expect } from 'vitest'

BddTest().given('an AvInput', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvInput>>

  BddTest().and('with default props', () => {
    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput)
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render an input element', () => {
        expect(wrapper.find('input').exists()).toBe(true)
      })

      BddTest().then('it should render with the base wrapper class', () => {
        expect(wrapper.find('.av-input').exists()).toBe(true)
      })

      BddTest().then('it should default to text type', () => {
        const input = wrapper.find('input')
        expect(input.attributes('type')).toBe('text')
      })

      BddTest().then('it should generate a unique id', () => {
        const input = wrapper.find('input')
        expect(input.attributes('id')).toBeDefined()
      })
    })
  })

  BddTest().and('with a given label', () => {
    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          label: 'Test Label'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the label', () => {
        const label = wrapper.find('label')
        expect(label.exists()).toBe(true)
        expect(label.text()).toBe('Test Label')
      })

      BddTest().then('it should link the label to the input', () => {
        const label = wrapper.find('label')
        const input = wrapper.find('input')
        expect(label.attributes('for')).toBe(input.attributes('id'))
      })
    })
  })

  BddTest().and('with a custom id', () => {
    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          id: 'custom-id',
          label: 'Test Label'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should use the provided id', () => {
        const input = wrapper.find('input')
        expect(input.attributes('id')).toBe('custom-id')
      })

      BddTest().then('it should link the label to the custom id', () => {
        const label = wrapper.find('label')
        expect(label.attributes('for')).toBe('custom-id')
      })
    })
  })

  BddTest().and('with a hint', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          hint: 'Test hint'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the hint text', () => {
        const hint = wrapper.find('.fr-hint-text')
        expect(hint.exists()).toBe(true)
        expect(hint.text()).toBe('Test hint')
      })
    })
  })

  BddTest().and('with textarea mode', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          isTextarea: true
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render a textarea element', () => {
        expect(wrapper.find('textarea').exists()).toBe(true)
      })

      BddTest().then('it should not render an input element', () => {
        expect(wrapper.find('input').exists()).toBe(false)
      })
    })
  })

  BddTest().and('with placeholder', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          placeholder: 'Test placeholder'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should set the placeholder attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('placeholder')).toBe('Test placeholder')
      })
    })
  })

  BddTest().and('with disabled state', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          disabled: true
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should set the disabled attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('disabled')).toBeDefined()
      })
    })
  })

  BddTest().and('with required state', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          required: true
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should set the required attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('required')).toBeDefined()
      })
    })
  })

  BddTest().and('with length constraints', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          maxlength: 50,
          minlength: 5
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should set the maxlength attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('maxlength')).toBe('50')
      })

      BddTest().then('it should set the minlength attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('minlength')).toBe('5')
      })
    })
  })

  BddTest().and('with different input types', () => {
    const inputTypes = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] as const

    inputTypes.forEach((type) => {
      describe(`when the component is mounted with type "${type}"`, () => {
        let wrapper: ReturnType<typeof mount<typeof AvInput>>

        beforeEach(() => {
          wrapper = mount<typeof AvInput>(AvInput, {
            props: {
              type
            }
          })
        })

        BddTest().then(`it should set the type attribute to "${type}"`, () => {
          const input = wrapper.find('input')
          expect(input.attributes('type')).toBe(type)
        })
      })
    })
  })

  BddTest().and('with error message', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          errorMessage: 'Test error message'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the error message', () => {
        const error = wrapper.find('.av-input__error')
        expect(error.exists()).toBe(true)
        expect(error.text()).toBe('Test error message')
      })

      BddTest().then('it should set role="alert" on error container', () => {
        const error = wrapper.find('.av-input__error')
        expect(error.attributes('role')).toBe('alert')
      })
    })
  })

  BddTest().and('with multiple error messages', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>
    const errorMessages = ['Error 1', 'Error 2', 'Error 3']

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          errorMessage: errorMessages
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render all error messages', () => {
        const errorElements = wrapper.findAll('.av-input__error-message')
        expect(errorElements).toHaveLength(3)
        expect(errorElements[0].text()).toBe('Error 1')
        expect(errorElements[1].text()).toBe('Error 2')
        expect(errorElements[2].text()).toBe('Error 3')
      })
    })
  })

  BddTest().and('with valid message', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          validMessage: 'Test valid message'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the valid message', () => {
        const valid = wrapper.find('.av-input__valid')
        expect(valid.exists()).toBe(true)
        expect(valid.text()).toBe('Test valid message')
      })
    })
  })

  BddTest().and('with multiple valid messages', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>
    const validMessages = ['Valid 1', 'Valid 2']

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          validMessage: validMessages
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render all valid messages', () => {
        const validElements = wrapper.findAll('.av-input__valid-message')
        expect(validElements).toHaveLength(2)
        expect(validElements[0].text()).toBe('Valid 1')
        expect(validElements[1].text()).toBe('Valid 2')
      })
    })
  })

  BddTest().and('with prefix icon', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          prefixIcon: 'mdi:magnify'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the prefix icon container', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        expect(prefixIcon.exists()).toBe(true)
      })

      BddTest().then('it should render the AvVIcon component with correct props', () => {
        const iconComponent = wrapper.findComponent({ name: 'AvVIcon' })
        expect(iconComponent.exists()).toBe(true)
        expect(iconComponent.props('name')).toBe('mdi:magnify')
        expect(iconComponent.props('size')).toBe(1.2)
      })
    })
  })

  BddTest().and('without prefix icon', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput)
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should not render the prefix icon container', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        expect(prefixIcon.exists()).toBe(false)
      })
    })
  })

  BddTest().and('with prefix icon and validation', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          prefixIcon: 'mdi:email-outline',
          errorMessage: 'Invalid email'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render both prefix icon and error message', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        const errorMessage = wrapper.find('.av-input__error-message')

        expect(prefixIcon.exists()).toBe(true)
        expect(errorMessage.exists()).toBe(true)
        expect(errorMessage.text()).toBe('Invalid email')
      })
    })
  })

  BddTest().and('with custom label class', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          label: 'Test Label',
          labelClass: 'custom-label'
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should apply the custom label class', () => {
        const label = wrapper.find('label')
        expect(label.classes()).toContain('custom-label')
      })
    })
  })

  BddTest().and('with v-model', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          modelValue: 'initial value'
        }
      })
    })

    BddTest().when('the user types in the input', () => {
      BddTest().then('it should emit update:modelValue event', async () => {
        const input = wrapper.find('input')
        await input.setValue('new value')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
      })
    })
  })

  BddTest().and('with prefix icon and textarea', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          prefixIcon: 'mdi:message-outline',
          isTextarea: true
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render both prefix icon and textarea', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        const textarea = wrapper.find('textarea')

        expect(prefixIcon.exists()).toBe(true)
        expect(textarea.exists()).toBe(true)
      })
    })
  })

  BddTest().and('with prefix icon and disabled state', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          prefixIcon: 'mdi:magnify',
          disabled: true
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render prefix icon with disabled input', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        const input = wrapper.find('input')

        expect(prefixIcon.exists()).toBe(true)
        expect(input.attributes('disabled')).toBeDefined()
      })
    })
  })
})

BddTest().given('multiple AvInput components', () => {
  let wrapper1: ReturnType<typeof mount<typeof AvInput>>
  let wrapper2: ReturnType<typeof mount<typeof AvInput>>

  beforeEach(() => {
    wrapper1 = mount<typeof AvInput>(AvInput)
    wrapper2 = mount<typeof AvInput>(AvInput)
  })

  BddTest().when('both components are mounted', () => {
    BddTest().then('they should have unique ids', () => {
      const input1 = wrapper1.find('input')
      const input2 = wrapper2.find('input')

      expect(input1.attributes('id')).toBeDefined()
      expect(input2.attributes('id')).toBeDefined()
      expect(input1.attributes('id')).not.toBe(input2.attributes('id'))
    })
  })
})
