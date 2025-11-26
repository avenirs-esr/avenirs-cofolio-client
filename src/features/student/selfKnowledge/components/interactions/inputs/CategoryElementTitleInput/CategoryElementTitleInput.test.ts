import CategoryElementTitleInput from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('the CategoryElementTitleInput component', () => {
  let wrapper: VueWrapper<InstanceType<typeof CategoryElementTitleInput>>

  const stubs = {
    AvInput: AvInputStub
  }

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render AvInput', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.exists()).toBe(true)
    })

    BddTest().then('it should not be textarea mode', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('isTextarea')).toBe(false)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('labelVisible')).toBe(true)
    })

    BddTest().then('it should not be disabled by default', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('disabled')).toBe(false)
    })

    BddTest().then('it should be required by default', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('required')).toBe(true)
    })

    BddTest().then('it should display default label', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('label')).toBe('Intitulé de votre élément')
    })

    BddTest().then('it should display default placeholder', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('placeholder')).toBe('Saisir un nom pour votre élément')
    })

    BddTest().then('it should have default prefix icon', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('prefixIcon')).toBe(MDI_ICONS.ATTACH_FILE)
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
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
      wrapper = mount(CategoryElementTitleInput, {
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

  BddTest().when('the component is mounted with custom prefix icon', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          prefixIcon: 'mdi:star'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom prefix icon', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('prefixIcon')).toBe('mdi:star')
    })
  })

  BddTest().when('the component is mounted with disabled prop', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
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

  BddTest().when('the component is mounted with required set to false', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          required: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not be required', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('required')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
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
      wrapper = mount(CategoryElementTitleInput, {
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
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          modelValue: 'Initial title'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('modelValue')).toBe('Initial title')
    })

    BddTest().then('it should emit update:modelValue when value changes', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      avInput.vm.$emit('update:modelValue', 'Updated title')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Updated title'])
    })
  })

  BddTest().when('the component is mounted with labelVisible set to false', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
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

  BddTest().when('the component is mounted with isTextarea prop', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementTitleInput, {
        props: {
          isTextarea: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should remain as input field', () => {
      const avInput = wrapper.findComponent(AvInputStub)
      expect(avInput.props('isTextarea')).toBe(true)
    })
  })
})
