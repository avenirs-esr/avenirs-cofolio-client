import CategoryElementTitleInput from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.vue'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('the CategoryElementTitleInput component', () => {
  let wrapper: VueWrapper<InstanceType<typeof CategoryElementTitleInput>>

  const stubs = {
    AvInput: AvInputStub
  }

  const getAvInput = () => wrapper.findComponent(AvInputStub)

  const defaultProps = {}

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: defaultProps,
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render AvInput', () => {
      const avInput = getAvInput()
      expect(avInput.exists()).toBe(true)
    })

    BddTest().then('it should not be textarea mode', () => {
      const avInput = getAvInput()
      expect(avInput.props('isTextarea')).toBe(false)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      const avInput = getAvInput()
      expect(avInput.props('labelVisible')).toBe(true)
    })

    BddTest().then('it should not be disabled by default', () => {
      const avInput = getAvInput()
      expect(avInput.props('disabled')).toBe(false)
    })

    BddTest().then('it should be required by default', () => {
      const avInput = getAvInput()
      expect(avInput.props('required')).toBe(true)
    })

    BddTest().then('it should display default label', () => {
      const avInput = getAvInput()
      expect(avInput.props('label')).toBe('Intitulé de votre élément')
    })

    BddTest().then('it should display default placeholder', () => {
      const avInput = getAvInput()
      expect(avInput.props('placeholder')).toBe('Saisir un nom pour votre élément')
    })

    BddTest().then('it should not display a prefix icon by default', () => {
      const avInput = getAvInput()
      expect(avInput.props('prefixIcon')).toBeUndefined()
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          label: 'Custom Label'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom label', () => {
      const avInput = getAvInput()
      expect(avInput.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with custom placeholder', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          placeholder: 'Custom Placeholder'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom placeholder', () => {
      const avInput = getAvInput()
      expect(avInput.props('placeholder')).toBe('Custom Placeholder')
    })
  })

  BddTest().when('the component is mounted with custom prefix icon', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          prefixIcon: 'mdi:star'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom prefix icon', () => {
      const avInput = getAvInput()
      expect(avInput.props('prefixIcon')).toBe('mdi:star')
    })
  })

  BddTest().when('the component is mounted with disabled prop', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          disabled: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should be disabled', () => {
      const avInput = getAvInput()
      expect(avInput.props('disabled')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with required set to false', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          required: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not be required', () => {
      const avInput = getAvInput()
      expect(avInput.props('required')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          errorMessage: 'Ce champ est requis.'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the error message', () => {
      const avInput = getAvInput()
      expect(avInput.props('errorMessage')).toBe('Ce champ est requis.')
    })
  })

  BddTest().when('the component is mounted with isValid prop', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          isValid: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass isValid to AvInput', () => {
      const avInput = getAvInput()
      expect(avInput.props('isValid')).toBe(true)
    })
  })

  BddTest().when('the component receives v-model updates', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          modelValue: 'Initial title'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const avInput = getAvInput()
      expect(avInput.props('modelValue')).toBe('Initial title')
    })

    BddTest().then('it should emit update:modelValue when value changes', () => {
      const avInput = getAvInput()
      avInput.vm.$emit('update:modelValue', 'Updated title')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Updated title'])
    })
  })

  BddTest().when('the component is mounted with labelVisible set to false', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          labelVisible: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should hide the label', () => {
      const avInput = getAvInput()
      expect(avInput.props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with isTextarea prop', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          ...defaultProps,
          isTextarea: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should remain as input field', () => {
      const avInput = getAvInput()
      expect(avInput.props('isTextarea')).toBe(true)
    })
  })
})
