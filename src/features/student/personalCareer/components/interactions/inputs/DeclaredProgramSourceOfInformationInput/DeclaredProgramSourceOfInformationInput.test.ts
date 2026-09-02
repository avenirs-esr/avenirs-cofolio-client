import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import DeclaredProgramSourceOfInformationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramSourceOfInformationInput/DeclaredProgramSourceOfInformationInput.vue'
import { DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared program source of information input', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramSourceOfInformationInput>>

  const stubs = {
    Input: InputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramSourceOfInformationInput, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the Input component', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have default label from i18n', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('label')).toBe('Source de l\'information')
    })

    BddTest().then('it should have default placeholder from i18n', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('placeholder')).toBe('Fiche ou page de la formation sur le site de l\'établissement, etc...')
    })

    BddTest().then('it should have default prefix icon', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.NEWSPAPER_VARIANT)
    })

    BddTest().then('it should have max length from config', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('maxlength')).toBe(DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('labelVisible')).toBe(true)
    })

    BddTest().and('the user enters text', () => {
      BddTest().then('it should update the model value', async () => {
        const input = wrapper.findComponent(InputStub)
        await input.vm.$emit('update:modelValue', 'University website')
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['University website'])
      })
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramSourceOfInformationInput, {
        props: {
          label: 'Custom Label'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should override default label', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with custom prefix icon', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramSourceOfInformationInput, {
        props: {
          prefixIcon: MDI_ICONS.ATTACH_FILE
        },
        global: { stubs }
      })
    })

    BddTest().then('it should override default prefix icon', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.ATTACH_FILE)
    })
  })

  BddTest().when('the component is mounted with custom placeholder', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramSourceOfInformationInput, {
        props: {
          placeholder: 'Custom Placeholder'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should override default placeholder', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('placeholder')).toBe('Custom Placeholder')
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramSourceOfInformationInput, {
        props: {
          modelValue: 'Initial source'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('Initial source')
    })
  })

  BddTest().when('the component uses default custom captions template', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramSourceOfInformationInput, {
        props: {
          modelValue: 'Test'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display character count', () => {
      expect(wrapper.text()).toContain('4 / 200')
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramSourceOfInformationInput, {
        props: {
          errorMessage: 'This field is required'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass error message to Input', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('errorMessage')).toBe('This field is required')
    })
  })
})
