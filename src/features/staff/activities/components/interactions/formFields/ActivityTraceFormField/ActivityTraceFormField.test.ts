import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import ActivityTraceFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.vue'
import {
  ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN,
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
} from '@/features/staff/activities/config'
import { ToggleParameterCardStub } from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.stub'
import { AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

function createTestWrapper (
  initialValue = ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
  disabled = false,
) {
  return createFormFieldTestWrapper<EditActivityFormData, 'traceAllowedAssociations'>({
    formFieldComponent: ActivityTraceFormField,
    fieldName: 'traceAllowedAssociations',
    defaultValue: initialValue,
    extraProps: {
      disabled,
    },
    useValidator: () => () => undefined,
  })
}

BddTest().given('an ActivityTraceFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityTraceFormField>>

  const stubs = {
    Input: InputStub,
    ToggleParameterCard: ToggleParameterCardStub,
    AvMessage: AvMessageStub,
  }

  const mountField = (
    initialValue = ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
    disabled = false,
  ) => {
    const TestWrapper = createTestWrapper(initialValue, disabled)

    wrapper = mount(TestWrapper, {
      global: { stubs },
    }) as unknown as VueWrapper<InstanceType<typeof ActivityTraceFormField>>
  }

  const getInput = () => wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>

  const getToggleParameterCard = () =>
    wrapper.findComponent(ToggleParameterCardStub) as VueWrapper<InstanceType<typeof ToggleParameterCardStub>>

  const getInfinityToggleInput = () => wrapper.find('#trace-infinity-toggle-input')

  const getMessage = () =>
    wrapper.findComponent(AvMessageStub) as VueWrapper<InstanceType<typeof AvMessageStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    mountField()
  })

  BddTest().when('the component is mounted with infinity value', () => {
    BddTest().then('it should render the parameter card', () => {
      expect(getToggleParameterCard().exists()).toBe(true)
    })

    BddTest().then('it should keep the parameter card enabled', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the infinity toggle', () => {
      expect(getInfinityToggleInput().exists()).toBe(true)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should render the future disabled information message', () => {
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Après la publication de l\'activité et suite à l\'inscription d\'un apprenant ce champ ne sera plus modifiable',
      )
    })
  })

  BddTest().when('the component is mounted with disabled prop', () => {
    beforeEach(() => {
      mountField(ACTIVITY_TRACE_SETTING_INFINITY_VALUE, true)
    })

    BddTest().then('it should render the disabled information message', () => {
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.',
      )
    })

    BddTest().then('it should disable the parameter card', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(true)
    })

    BddTest().then('it should disable the infinity toggle', () => {
      expect(getInfinityToggleInput().attributes('disabled')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with a numeric value', () => {
    beforeEach(() => {
      mountField(ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN)
    })

    BddTest().then('it should keep the parameter card enabled', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the infinity toggle', () => {
      expect(getInfinityToggleInput().exists()).toBe(true)
    })

    BddTest().then('it should show the numeric input with the configured min', () => {
      expect(getInput().exists()).toBe(true)
      expect(getInput().props('min')).toBe(ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN)
    })

    BddTest().then('it should keep the numeric input enabled', () => {
      expect(getInput().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the future disabled information message', () => {
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Après la publication de l\'activité et suite à l\'inscription d\'un apprenant ce champ ne sera plus modifiable',
      )
    })
  })

  BddTest().when('trace associations are disabled by value', () => {
    beforeEach(() => {
      mountField(ACTIVITY_TRACE_SETTING_DISABLED_VALUE)
    })

    BddTest().then('it should keep the parameter card enabled', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(false)
    })

    BddTest().then('it should hide the infinity toggle', () => {
      expect(getInfinityToggleInput().exists()).toBe(false)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should render the future disabled information message', () => {
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Après la publication de l\'activité et suite à l\'inscription d\'un apprenant ce champ ne sera plus modifiable',
      )
    })
  })
})
