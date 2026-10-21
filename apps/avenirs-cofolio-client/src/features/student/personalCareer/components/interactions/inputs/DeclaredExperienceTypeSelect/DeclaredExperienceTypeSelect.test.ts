import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { EExperienceType } from '@/api/avenir-esr'
import DeclaredExperienceTypeSelect
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTypeSelect/DeclaredExperienceTypeSelect.vue'

BddTest().given('a declared experience type select component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceTypeSelect>>

  const stubs = {
    AvSelect: AvSelectStub,
  }

  const getAvSelect = () => wrapper.findComponent(AvSelectStub)

  const mountWith = (modelValue?: { itemId: EExperienceType }) => {
    wrapper = mount(DeclaredExperienceTypeSelect, {
      props: {
        modelValue,
      },
      global: { stubs },
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mountWith()
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the AvSelect component', () => {
      expect(getAvSelect().exists()).toBe(true)
    })

    BddTest().then('it should display the correct French label', () => {
      expect(getAvSelect().props('label')).toBe('Type d\'expérience')
    })

    BddTest().then('it should display the correct placeholder', () => {
      expect(getAvSelect().props('placeholder')).toBe('Sélectionnez un type')
    })

    BddTest().then('it should display the correct prefix icon', () => {
      expect(getAvSelect().props('prefixIcon')).toBe(MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE)
    })

    BddTest().then('it should expose three experience type options', () => {
      expect(getAvSelect().props('options')).toHaveLength(3)
    })

    BddTest().then('it should provide the professional experience option', () => {
      expect(getAvSelect().props('options')).toContainEqual({
        value: EExperienceType.PROFESSIONAL,
        label: 'Expérience professionnelle',
      })
    })

    BddTest().then('it should provide the personal experience option', () => {
      expect(getAvSelect().props('options')).toContainEqual({
        value: EExperienceType.PERSONAL,
        label: 'Expérience personnelle',
      })
    })

    BddTest().then('it should provide the volunteer experience option', () => {
      expect(getAvSelect().props('options')).toContainEqual({
        value: EExperienceType.VOLUNTEER,
        label: 'Engagement et/ou bénévolat',
      })
    })

    BddTest().then('it should configure the select to occupy the full width', () => {
      expect(getAvSelect().props('width')).toBe('100%')
    })

    BddTest().then('it should make the label visible', () => {
      expect(getAvSelect().props('labelVisible')).toBe(true)
    })

    BddTest().then('it should not have a selected option by default', () => {
      expect(getAvSelect().props('modelValue')).toBeNull()
    })
  })

  BddTest().when('the component is mounted with an error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          errorMessage: 'Ce champ est requis',
        },
        global: { stubs },
      })
    })

    BddTest().then('it should pass the error message to AvSelect', () => {
      expect(getAvSelect().props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the user selects professional experience', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mountWith()

      getAvSelect().vm.$emit('update:modelValue', {
        value: EExperienceType.PROFESSIONAL,
        label: 'Expérience professionnelle',
      })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit the selected experience type in the public model format', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([
        [{ itemId: EExperienceType.PROFESSIONAL }],
      ])
    })

    BddTest().then('it should update the selected option', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: EExperienceType.PROFESSIONAL,
        label: 'Expérience professionnelle',
      })
    })
  })

  BddTest().when('the user selects volunteer experience', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mountWith()

      getAvSelect().vm.$emit('update:modelValue', {
        value: EExperienceType.VOLUNTEER,
        label: 'Expérience bénévole',
      })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit the selected experience type in the public model format', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([
        [{ itemId: EExperienceType.VOLUNTEER }],
      ])
    })

    BddTest().then('it should update the selected option', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: EExperienceType.VOLUNTEER,
        label: 'Engagement et/ou bénévolat',
      })
    })
  })

  BddTest().when('the user selects personal experience', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mountWith()

      getAvSelect().vm.$emit('update:modelValue', {
        value: EExperienceType.PERSONAL,
        label: 'Expérience personnelle',
      })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit the selected experience type in the public model format', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([
        [{ itemId: EExperienceType.PERSONAL }],
      ])
    })

    BddTest().then('it should update the selected option', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: EExperienceType.PERSONAL,
        label: 'Expérience personnelle',
      })
    })
  })

  BddTest().when('the component is mounted with an initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mountWith({ itemId: EExperienceType.PROFESSIONAL })
    })

    BddTest().then('it should display the corresponding selected option', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: EExperienceType.PROFESSIONAL,
        label: 'Expérience professionnelle',
      })
    })
  })

  BddTest().when('the component receives additional props', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceTypeSelect, {
        props: {
          disabled: true,
          required: true,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should pass additional props to AvSelect', () => {
      expect(getAvSelect().props('disabled')).toBe(true)
      expect(getAvSelect().props('required')).toBe(true)
    })
  })

  BddTest().when('the user clears the selection', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mountWith({ itemId: EExperienceType.PROFESSIONAL })

      getAvSelect().vm.$emit('update:modelValue', null)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not emit a new public model value', () => {
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    BddTest().then('it should keep the current selected option', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: EExperienceType.PROFESSIONAL,
        label: 'Expérience professionnelle',
      })
    })
  })
})
