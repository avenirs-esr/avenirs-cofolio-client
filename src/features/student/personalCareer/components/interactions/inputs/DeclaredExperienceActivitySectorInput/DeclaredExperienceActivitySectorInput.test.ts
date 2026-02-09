import DeclaredExperienceActivitySectorInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceActivitySectorInput/DeclaredExperienceActivitySectorInput.vue'
import { DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience activity sector input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceActivitySectorInput>>

  const stubs = {
    AvInput: AvInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
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
      expect(input.props('maxlength')).toBe(DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH)
    })

    BddTest().then('it should display the correct French label', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('label')).toBe('Secteur d\'activité')
    })

    BddTest().then('it should display the correct prefix icon', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('prefixIcon')).toBe(MDI_ICONS.BUILDING)
    })

    BddTest().then('it should display the correct placeholder', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('placeholder')).toBe('Secteur d\'activité')
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().then('it should NOT display the hint by default', () => {
    const input = wrapper.findComponent({ name: 'AvInput' })
    expect(input.props('hint')).toBeUndefined()
  })

  BddTest().when('the component is mounted in disabled state', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
        props: {
          modelValue: '',
          disabled: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the classification hint', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('hint')).toBe('Pour une classification reconnue, consultez le référentiel NAF (Nomenclature d\'Activités Française)')
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
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
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
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

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
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
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', 'Technology')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the model value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('Technology')
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
        props: {
          modelValue: 'Healthcare'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      expect(input.props('modelValue')).toBe('Healthcare')
    })
  })

  BddTest().when('the component receives additional props via restProps', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
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
      wrapper = mount(DeclaredExperienceActivitySectorInput, {
        props: {
          modelValue: 'Some sector'
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
