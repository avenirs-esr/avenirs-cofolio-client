import { EExperienceType } from '@/api/avenir-esr'
import DeclaredExperienceTypeSelect from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTypeSelect/DeclaredExperienceTypeSelect.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience type select component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceTypeSelect>>

  const stubs = {
    AvSelect: AvSelectStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          modelValue: undefined
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the AvSelect component', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should display the correct French label', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('label')).toBe('Type d\'expérience')
    })

    BddTest().then('it should display the correct placeholder', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('placeholder')).toBe('Sélectionnez un type')
    })

    BddTest().then('it should display the correct prefix icon', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('prefixIcon')).toBe(MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE)
    })

    BddTest().then('it should have two options', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('options')).toHaveLength(2)
    })

    BddTest().then('it should have professional experience option', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      const options = select.props('options')
      const professionalOption = options.find((opt: { value: EExperienceType }) => opt.value === EExperienceType.PROFESSIONAL)
      expect(professionalOption).toBeDefined()
      expect(professionalOption.text).toBe('Expérience professionnelle')
      expect(professionalOption.value).toBe(EExperienceType.PROFESSIONAL)
    })

    BddTest().then('it should have personal experience option', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      const options = select.props('options')
      const personalOption = options.find((opt: { value: EExperienceType }) => opt.value === EExperienceType.PERSONAL)
      expect(personalOption).toBeDefined()
      expect(personalOption.text).toBe('Expérience personnelle')
      expect(personalOption.value).toBe(EExperienceType.PERSONAL)
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          label: 'Custom Label',
          modelValue: undefined
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom label', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          errorMessage: 'Ce champ est requis',
          modelValue: undefined
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the error message to AvSelect', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the user selects professional experience', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          modelValue: undefined
        },
        global: { stubs }
      })
      const select = wrapper.findComponent({ name: 'AvSelect' })
      await select.vm.$emit('update:modelValue', EExperienceType.PROFESSIONAL)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the model value', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('modelValue')).toBe(EExperienceType.PROFESSIONAL)
    })
  })

  BddTest().when('the user selects personal experience', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          modelValue: undefined
        },
        global: { stubs }
      })
      const select = wrapper.findComponent({ name: 'AvSelect' })
      await select.vm.$emit('update:modelValue', EExperienceType.PERSONAL)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the model value', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('modelValue')).toBe(EExperienceType.PERSONAL)
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          modelValue: EExperienceType.PROFESSIONAL
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('modelValue')).toBe(EExperienceType.PROFESSIONAL)
    })
  })

  BddTest().when('the component receives additional props via restProps', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          disabled: true,
          required: true,
          modelValue: undefined
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass additional props to AvSelect', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('disabled')).toBe(true)
      expect(select.props('required')).toBe(true)
    })
  })

  BddTest().when('the user clears the selection', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          modelValue: EExperienceType.PROFESSIONAL
        },
        global: { stubs }
      })
      const select = wrapper.findComponent({ name: 'AvSelect' })
      await select.vm.$emit('update:modelValue', undefined)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update to undefined value', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('modelValue')).toBeUndefined()
    })
  })
})
