import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import ActivityReflectionFormField from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.vue'
import { ToggleParameterCardStub } from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.stub'
import { AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

function createTestWrapper (
  initialValue = true,
  disabled = false,
) {
  return createFormFieldTestWrapper<EditActivityFormData, 'enableReflection'>({
    formFieldComponent: ActivityReflectionFormField,
    fieldName: 'enableReflection',
    defaultValue: initialValue,
    extraProps: {
      disabled,
    },
    useValidator: () => () => undefined,
  })
}

BddTest().given('an ActivityReflectionFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityReflectionFormField>>

  const stubs = {
    ToggleParameterCard: ToggleParameterCardStub,
    AvMessage: AvMessageStub,
  }

  const mountField = (
    initialValue = true,
    disabled = false,
  ) => {
    const TestWrapper = createTestWrapper(initialValue, disabled)

    wrapper = mount(TestWrapper, {
      global: { stubs },
    }) as unknown as VueWrapper<InstanceType<typeof ActivityReflectionFormField>>
  }

  const getToggleParameterCard = () =>
    wrapper.findComponent(ToggleParameterCardStub) as VueWrapper<InstanceType<typeof ToggleParameterCardStub>>

  const getMessage = () =>
    wrapper.findComponent(AvMessageStub) as VueWrapper<InstanceType<typeof AvMessageStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    mountField()
  })

  BddTest().when('the component is mounted with reflection enabled', () => {
    BddTest().then('it should render the parameter card', () => {
      expect(getToggleParameterCard().exists()).toBe(true)
    })

    BddTest().then('it should have the parameter card checked', () => {
      expect(getToggleParameterCard().props('modelValue')).toBe(true)
    })

    BddTest().then('it should keep the parameter card enabled', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the future disabled information message', () => {
      expect(getMessage().exists()).toBe(true)
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Après la publication de l\'activité et suite à l\'inscription d\'un apprenant ce champ ne sera plus modifiable',
      )
    })
  })

  BddTest().when('the component is mounted with disabled prop', () => {
    beforeEach(() => {
      mountField(true, true)
    })

    BddTest().then('it should disable the parameter card', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(true)
    })

    BddTest().then('it should render the disabled information message', () => {
      expect(getMessage().exists()).toBe(true)
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.',
      )
    })
  })

  BddTest().when('the component is mounted with reflection disabled by value', () => {
    beforeEach(() => {
      mountField(false)
    })

    BddTest().then('it should render the parameter card', () => {
      expect(getToggleParameterCard().exists()).toBe(true)
    })

    BddTest().then('it should have the parameter card unchecked', () => {
      expect(getToggleParameterCard().props('modelValue')).toBe(false)
    })

    BddTest().then('it should keep the parameter card enabled', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the future disabled information message', () => {
      expect(getMessage().exists()).toBe(true)
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Après la publication de l\'activité et suite à l\'inscription d\'un apprenant ce champ ne sera plus modifiable',
      )
    })
  })

  BddTest().when('the component is mounted with reflection disabled by value and disabled prop', () => {
    beforeEach(() => {
      mountField(false, true)
    })

    BddTest().then('it should have the parameter card unchecked', () => {
      expect(getToggleParameterCard().props('modelValue')).toBe(false)
    })

    BddTest().then('it should disable the parameter card', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(true)
    })

    BddTest().then('it should render the disabled information message', () => {
      expect(getMessage().props('message')).toEqual(
        'Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.',
      )
    })
  })
})
