import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AvInput from './AvInput.vue'

describe('avInput', () => {
  describe('given an AvInput component', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput)
    })

    describe('when the component is mounted with default props', () => {
      it('then it should render an input element', () => {
        expect(wrapper.find('input').exists()).toBe(true)
      })

      it('then it should render with the base wrapper class', () => {
        expect(wrapper.find('.av-input').exists()).toBe(true)
      })

      it('then it should default to text type', () => {
        const input = wrapper.find('input')
        expect(input.attributes('type')).toBe('text')
      })

      it('then it should generate a unique id', () => {
        const input = wrapper.find('input')
        expect(input.attributes('id')).toBeDefined()
      })
    })
  })

  describe('given an AvInput component with a label', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          label: 'Test Label'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the label', () => {
        const label = wrapper.find('label')
        expect(label.exists()).toBe(true)
        expect(label.text()).toBe('Test Label')
      })

      it('then it should link the label to the input', () => {
        const label = wrapper.find('label')
        const input = wrapper.find('input')
        expect(label.attributes('for')).toBe(input.attributes('id'))
      })
    })
  })

  describe('given an AvInput component with a custom id', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          id: 'custom-id',
          label: 'Test Label'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should use the provided id', () => {
        const input = wrapper.find('input')
        expect(input.attributes('id')).toBe('custom-id')
      })

      it('then it should link the label to the custom id', () => {
        const label = wrapper.find('label')
        expect(label.attributes('for')).toBe('custom-id')
      })
    })
  })

  describe('given an AvInput component with a hint', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          hint: 'Test hint'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the hint text', () => {
        const hint = wrapper.find('.fr-hint-text')
        expect(hint.exists()).toBe(true)
        expect(hint.text()).toBe('Test hint')
      })
    })
  })

  describe('given an AvInput component with textarea mode', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          isTextarea: true
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render a textarea element', () => {
        expect(wrapper.find('textarea').exists()).toBe(true)
      })

      it('then it should not render an input element', () => {
        expect(wrapper.find('input').exists()).toBe(false)
      })
    })
  })

  describe('given an AvInput component with placeholder', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          placeholder: 'Test placeholder'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should set the placeholder attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('placeholder')).toBe('Test placeholder')
      })
    })
  })

  describe('given an AvInput component with disabled state', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          disabled: true
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should set the disabled attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('disabled')).toBeDefined()
      })
    })
  })

  describe('given an AvInput component with required state', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          required: true
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should set the required attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('required')).toBeDefined()
      })
    })
  })

  describe('given an AvInput component with length constraints', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          maxlength: 50,
          minlength: 5
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should set the maxlength attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('maxlength')).toBe('50')
      })

      it('then it should set the minlength attribute', () => {
        const input = wrapper.find('input')
        expect(input.attributes('minlength')).toBe('5')
      })
    })
  })

  describe('given an AvInput component with different input types', () => {
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

        it(`then it should set the type attribute to "${type}"`, () => {
          const input = wrapper.find('input')
          expect(input.attributes('type')).toBe(type)
        })
      })
    })
  })

  describe('given an AvInput component with error message', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          errorMessage: 'Test error message'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the error message', () => {
        const error = wrapper.find('.av-input__error')
        expect(error.exists()).toBe(true)
        expect(error.text()).toBe('Test error message')
      })

      it('then it should set role="alert" on error container', () => {
        const error = wrapper.find('.av-input__error')
        expect(error.attributes('role')).toBe('alert')
      })
    })
  })

  describe('given an AvInput component with multiple error messages', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>
    const errorMessages = ['Error 1', 'Error 2', 'Error 3']

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          errorMessage: errorMessages
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render all error messages', () => {
        const errorElements = wrapper.findAll('.av-input__error-message')
        expect(errorElements).toHaveLength(3)
        expect(errorElements[0].text()).toBe('Error 1')
        expect(errorElements[1].text()).toBe('Error 2')
        expect(errorElements[2].text()).toBe('Error 3')
      })
    })
  })

  describe('given an AvInput component with valid message', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          validMessage: 'Test valid message'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the valid message', () => {
        const valid = wrapper.find('.av-input__valid')
        expect(valid.exists()).toBe(true)
        expect(valid.text()).toBe('Test valid message')
      })
    })
  })

  describe('given an AvInput component with multiple valid messages', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>
    const validMessages = ['Valid 1', 'Valid 2']

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          validMessage: validMessages
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render all valid messages', () => {
        const validElements = wrapper.findAll('.av-input__valid-message')
        expect(validElements).toHaveLength(2)
        expect(validElements[0].text()).toBe('Valid 1')
        expect(validElements[1].text()).toBe('Valid 2')
      })
    })
  })

  describe('given an AvInput component with prefix icon', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          prefixIcon: 'mdi:magnify'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the prefix icon container', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        expect(prefixIcon.exists()).toBe(true)
      })

      it('then it should render the AvVIcon component with correct props', () => {
        const iconComponent = wrapper.findComponent({ name: 'AvVIcon' })
        expect(iconComponent.exists()).toBe(true)
        expect(iconComponent.props('name')).toBe('mdi:magnify')
        expect(iconComponent.props('size')).toBe(1.2)
      })
    })
  })

  describe('given an AvInput component without prefix icon', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput)
    })

    describe('when the component is mounted', () => {
      it('then it should not render the prefix icon container', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        expect(prefixIcon.exists()).toBe(false)
      })
    })
  })

  describe('given an AvInput component with prefix icon and validation', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          prefixIcon: 'mdi:email-outline',
          errorMessage: 'Invalid email'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render both prefix icon and error message', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        const errorMessage = wrapper.find('.av-input__error-message')

        expect(prefixIcon.exists()).toBe(true)
        expect(errorMessage.exists()).toBe(true)
        expect(errorMessage.text()).toBe('Invalid email')
      })
    })
  })

  describe('given an AvInput component with custom label class', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          label: 'Test Label',
          labelClass: 'custom-label'
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should apply the custom label class', () => {
        const label = wrapper.find('label')
        expect(label.classes()).toContain('custom-label')
      })
    })
  })

  describe('given an AvInput component with v-model', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          modelValue: 'initial value'
        }
      })
    })

    describe('when the user types in the input', () => {
      it('then it should emit update:modelValue event', async () => {
        const input = wrapper.find('input')
        await input.setValue('new value')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
      })
    })
  })

  describe('given multiple AvInput components', () => {
    let wrapper1: ReturnType<typeof mount<typeof AvInput>>
    let wrapper2: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper1 = mount<typeof AvInput>(AvInput)
      wrapper2 = mount<typeof AvInput>(AvInput)
    })

    describe('when both components are mounted', () => {
      it('then they should have unique ids', () => {
        const input1 = wrapper1.find('input')
        const input2 = wrapper2.find('input')

        expect(input1.attributes('id')).toBeDefined()
        expect(input2.attributes('id')).toBeDefined()
        expect(input1.attributes('id')).not.toBe(input2.attributes('id'))
      })
    })
  })

  describe('given an AvInput component with prefix icon and textarea', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          prefixIcon: 'mdi:message-outline',
          isTextarea: true
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render both prefix icon and textarea', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        const textarea = wrapper.find('textarea')

        expect(prefixIcon.exists()).toBe(true)
        expect(textarea.exists()).toBe(true)
      })
    })
  })

  describe('given an AvInput component with prefix icon and disabled state', () => {
    let wrapper: ReturnType<typeof mount<typeof AvInput>>

    beforeEach(() => {
      wrapper = mount<typeof AvInput>(AvInput, {
        props: {
          prefixIcon: 'mdi:magnify',
          disabled: true
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render prefix icon with disabled input', () => {
        const prefixIcon = wrapper.find('.av-input__prefix')
        const input = wrapper.find('input')

        expect(prefixIcon.exists()).toBe(true)
        expect(input.attributes('disabled')).toBeDefined()
      })
    })
  })
})
