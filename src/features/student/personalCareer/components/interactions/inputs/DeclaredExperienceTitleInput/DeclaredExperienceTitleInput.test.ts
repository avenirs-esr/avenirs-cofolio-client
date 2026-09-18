import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ICONS } from '@/common/constants'
import DeclaredExperienceTitleInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTitleInput/DeclaredExperienceTitleInput.vue'
import { DECLARED_EXPERIENCE_TITLE_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience title input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceTitleInput>>

  const stubs = {
    Input: InputStub
  }

  const getInput = () => wrapper.findComponent(InputStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTitleInput, {
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
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      expect(getInput().props('labelVisible')).toBe(true)
    })

    BddTest().then('it should have maxlength prop set to config value', () => {
      expect(getInput().props('maxlength')).toBe(DECLARED_EXPERIENCE_TITLE_MAX_LENGTH)
    })

    BddTest().then('it should display the correct French label', () => {
      expect(getInput().props('label')).toBe('Intitulé du poste')
    })

    BddTest().then('it should display the correct prefix icon', () => {
      expect(getInput().props('prefixIcon')).toBe(ICONS.EXPERIENCES)
    })

    BddTest().then('it should display the correct placeholder', () => {
      expect(getInput().props('placeholder')).toBe('Titre de mon expérience')
    })

    BddTest().then('it should have empty initial value', () => {
      expect(getInput().props('modelValue')).toBe('')
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTitleInput, {
        props: {
          label: 'Custom Label',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom label', () => {
      expect(getInput().props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with custom placeholder', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTitleInput, {
        props: {
          placeholder: 'Custom Placeholder',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom placeholder', () => {
      expect(getInput().props('placeholder')).toBe('Custom Placeholder')
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTitleInput, {
        props: {
          errorMessage: 'Ce champ est requis',
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the error message to Input', () => {
      expect(getInput().props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the user types in the input', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTitleInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
      await getInput().vm.$emit('update:modelValue', 'Software Engineer')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the model value', () => {
      expect(getInput().props('modelValue')).toBe('Software Engineer')
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTitleInput, {
        props: {
          modelValue: 'Initial title'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      expect(getInput().props('modelValue')).toBe('Initial title')
    })
  })

  BddTest().when('the component receives additional props via restProps', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTitleInput, {
        props: {
          disabled: true,
          required: true,
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass additional props to Input', () => {
      const input = getInput()
      expect(input.props('disabled')).toBe(true)
      expect(input.props('required')).toBe(true)
    })
  })

  BddTest().when('the user clears the input', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTitleInput, {
        props: {
          modelValue: 'Some text'
        },
        global: { stubs }
      })
      await getInput().vm.$emit('update:modelValue', '')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update to empty value', () => {
      expect(getInput().props('modelValue')).toBe('')
    })
  })
})
