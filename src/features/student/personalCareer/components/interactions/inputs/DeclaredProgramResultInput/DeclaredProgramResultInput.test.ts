import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import DeclaredProgramResultInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramResultInput/DeclaredProgramResultInput.vue'
import { DECLARED_PROGRAM_RESULT_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared program result input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramResultInput>>

  const stubs = {
    Input: InputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the Input component', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('labelVisible')).toBe(true)
    })

    BddTest().then('it should have maxlength prop set to config value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('maxlength')).toBe(DECLARED_PROGRAM_RESULT_MAX_LENGTH)
    })

    BddTest().then('it should display the correct French label', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('label')).toBe('Résultat obtenu')
    })

    BddTest().then('it should display the correct prefix icon', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('prefixIcon')).toBe(RI_ICONS.LAYOUT_6_LINE)
    })

    BddTest().then('it should display the correct placeholder', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('placeholder')).toBe('Résultat')
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          label: 'Custom Label',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom label', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with custom placeholder', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          placeholder: 'Custom Placeholder',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom placeholder', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('placeholder')).toBe('Custom Placeholder')
    })
  })

  BddTest().when('the component is mounted with custom prefix icon', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          prefixIcon: 'mdi:account',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom prefix icon', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('prefixIcon')).toBe('mdi:account')
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          errorMessage: 'Ce champ est requis',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the error message to Input', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the user types in the input', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
      const input = wrapper.findComponent(InputStub)
      await input.vm.$emit('update:modelValue', 'Obtained result')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the model value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('Obtained result')
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          modelValue: 'Initial result'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('Initial result')
    })
  })

  BddTest().when('the component uses default custom captions template', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          modelValue: 'Test'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display character count', () => {
      expect(wrapper.text()).toContain('4 / 50')
    })
  })

  BddTest().when('the component receives additional props via restProps', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          disabled: true,
          required: true,
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass additional props to Input', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('disabled')).toBe(true)
      expect(input.props('required')).toBe(true)
    })
  })

  BddTest().when('the user clears the input', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramResultInput, {
        props: {
          modelValue: 'Some text'
        },
        global: { stubs }
      })
      const input = wrapper.findComponent(InputStub)
      await input.vm.$emit('update:modelValue', '')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update to empty value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('')
    })
  })
})
