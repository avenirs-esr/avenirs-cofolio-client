import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('an Input component', () => {
  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render an AvInput with correct translated labels', () => {
      const wrapper = mount(Input, {
        props: {
          maxlength: 10,
        },
        global: {
          stubs: { AvInput: AvInputStub }
        }
      })

      expect(wrapper.findComponent(AvInputStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvInputStub).props('maxlengthExceededMessage')).toBe('Veuillez limiter votre saisie à 10 caractères')
    })
  })

  BddTest().when('the component is mounted with an explicit error message', () => {
    BddTest().then('it should not pass maxlengthExceededMessage to avoid duplicate errors', () => {
      const wrapper = mount(Input, {
        props: {
          maxlength: 10,
          errorMessage: 'Server-side validation error',
        },
        global: {
          stubs: { AvInput: AvInputStub }
        }
      })

      expect(wrapper.findComponent(AvInputStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvInputStub).props('maxlengthExceededMessage')).toBeUndefined()
    })
  })
})
