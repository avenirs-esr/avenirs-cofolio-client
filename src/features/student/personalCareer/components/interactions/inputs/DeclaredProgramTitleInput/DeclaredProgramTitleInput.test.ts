import DeclaredProgramTitleInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramTitleInput/DeclaredProgramTitleInput.vue'
import { DECLARED_PROGRAM_TITLE_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared program title input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramTitleInput>>

  const stubs = {
    AvInput: AvInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the AvInput component', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('labelVisible')).toBe(true)
    })

    BddTest().then('it should have maxlength prop set to config value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('maxlength')).toBe(DECLARED_PROGRAM_TITLE_MAX_LENGTH)
    })

    BddTest().then('it should display the correct French label', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('label')).toBe('Intitulé de ma formation')
    })

    BddTest().then('it should display the correct prefix icon', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('prefixIcon')).toBe(RI_ICONS.LOADER_LINE)
    })

    BddTest().then('it should display the correct placeholder', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('placeholder')).toBe('Nom de ma formation 1')
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          label: 'Custom Label',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom label', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with custom placeholder', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          placeholder: 'Custom Placeholder',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom placeholder', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('placeholder')).toBe('Custom Placeholder')
    })
  })

  BddTest().when('the component is mounted with custom prefix icon', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          prefixIcon: MDI_ICONS.LINK,
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom prefix icon', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.LINK)
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          errorMessage: 'Ce champ est requis',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the error message to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the user types in the input', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', 'New title')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the model value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('New title')
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          modelValue: 'Initial title'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('Initial title')
    })
  })

  BddTest().when('the component receives additional props via restProps', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          disabled: true,
          required: true,
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass additional props to AvInput', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('disabled')).toBe(true)
      expect(input.props('required')).toBe(true)
    })
  })

  BddTest().when('the user clears the input', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredProgramTitleInput, {
        props: {
          modelValue: 'Some text'
        },
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', '')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update to empty value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })
})
