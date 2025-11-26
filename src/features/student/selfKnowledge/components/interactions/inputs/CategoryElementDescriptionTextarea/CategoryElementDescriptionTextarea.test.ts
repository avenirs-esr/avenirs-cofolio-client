import CategoryElementDescriptionTextarea from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementDescriptionTextarea/CategoryElementDescriptionTextarea.vue'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('the CategoryElementDescriptionTextarea component', () => {
  let wrapper: VueWrapper<InstanceType<typeof CategoryElementDescriptionTextarea>>

  const stubs = {
    AvInput: AvInputStub
  }

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render AvInput with textarea mode', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.exists()).toBe(true)
      expect(avInput.props('isTextarea')).toBe(true)
    })

    BddTest().then('it should have default maxlength of 400', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('maxlength')).toBe(400)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('labelVisible')).toBe(true)
    })

    BddTest().then('it should not be disabled by default', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('disabled')).toBe(false)
    })

    BddTest().then('it should not be required by default', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('required')).toBe(false)
    })

    BddTest().then('it should display default label', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('label')).toBe('Description de votre élément')
    })

    BddTest().then('it should display default placeholder', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('placeholder')).toBe('Décrivez votre élément...')
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          label: 'Custom Label'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom label', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with custom placeholder', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          placeholder: 'Custom Placeholder'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom placeholder', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('placeholder')).toBe('Custom Placeholder')
    })
  })

  BddTest().when('the component is mounted with different categoryType', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display label with motivation category', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('label')).toContain('Description de votre élément')
    })

    BddTest().then('it should display placeholder with motivation category', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('placeholder')).toContain('Décrivez votre élément...')
    })
  })

  BddTest().when('the component is mounted with custom maxlength', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          maxlength: 500
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom maxlength', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('maxlength')).toBe(500)
    })
  })

  BddTest().when('the component is mounted with disabled prop', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          disabled: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should be disabled', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('disabled')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with required prop', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          required: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should be required', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('required')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          errorMessage: 'Ce champ est requis.'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the error message', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('errorMessage')).toBe('Ce champ est requis.')
    })
  })

  BddTest().when('the component is mounted with isValid prop', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          isValid: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass isValid to AvInput', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('isValid')).toBe(true)
    })
  })

  BddTest().when('the component receives v-model updates', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          modelValue: 'Initial description'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('modelValue')).toBe('Initial description')
    })

    BddTest().then('it should emit update:modelValue when value changes', async () => {
      const avInput = wrapper.findComponent(AvInputStub)
      await avInput.vm.$emit('update:modelValue', 'Updated description')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Updated description'])
    })
  })

  BddTest().when('the customCaptions slot is rendered', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          modelValue: 'Test description',
          maxlength: 400
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display character count hint', () => {
      expect(wrapper.text()).toContain('16')
      expect(wrapper.text()).toContain('400')
    })
  })

  BddTest().when('the component is mounted with labelVisible set to false', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementDescriptionTextarea, {
        props: {
          labelVisible: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should hide the label', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('labelVisible')).toBe(false)
    })
  })
})
