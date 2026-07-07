import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import ActivityTraceFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.vue'
import {
  ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN,
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
} from '@/features/staff/activities/config'
import { AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

function createTestWrapper (initialValue = ACTIVITY_TRACE_SETTING_INFINITY_VALUE) {
  return createFormFieldTestWrapper<EditActivityFormData, 'traceAllowedAssociations'>({
    formFieldComponent: ActivityTraceFormField,
    fieldName: 'traceAllowedAssociations',
    defaultValue: initialValue,
    useValidator: () => () => undefined,
  })
}

BddTest().given('an ActivityTraceFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityTraceFormField>>

  const stubs = {
    Input: InputStub,
    Toggle: ToggleStub,
    AvMessage: AvMessageStub,
  }

  const mountField = (initialValue = ACTIVITY_TRACE_SETTING_INFINITY_VALUE) => {
    const TestWrapper = createTestWrapper(initialValue)

    wrapper = mount(TestWrapper, {
      global: { stubs },
    }) as unknown as VueWrapper<InstanceType<typeof ActivityTraceFormField>>
  }

  const getInput = () => wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>
  const getToggles = () => wrapper.findAllComponents(ToggleStub) as Array<VueWrapper<InstanceType<typeof ToggleStub>>>
  const getMainToggle = () => getToggles()[0]
  const getInfinityToggle = () => getToggles()[1]
  const getMessage = () => wrapper.findComponent(AvMessageStub) as VueWrapper<InstanceType<typeof AvMessageStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    mountField()
  })

  BddTest().when('the component is mounted with infinity value', () => {
    BddTest().then('it should render the main and infinity toggles', () => {
      expect(getToggles()).toHaveLength(2)
    })

    BddTest().then('it should have the main toggle checked', () => {
      expect(getMainToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should keep the main toggle enabled', () => {
      expect(getMainToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should have the infinity toggle checked', () => {
      expect(getInfinityToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should keep the infinity toggle enabled', () => {
      expect(getInfinityToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should render the information message', () => {
      expect(getMessage().exists()).toBe(true)
    })

    BddTest().then('it should render the information message as info', () => {
      expect(getMessage().props('type')).toBe('info')
    })

    BddTest().then('it should pass the disabled information message', () => {
      expect(getMessage().props('message')).toEqual('Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.')
    })
  })

  BddTest().when('the component is mounted with a numeric value', () => {
    beforeEach(() => {
      mountField(ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN)
    })

    BddTest().then('it should render the main and infinity toggles', () => {
      expect(getToggles()).toHaveLength(2)
    })

    BddTest().then('it should keep the main toggle checked', () => {
      expect(getMainToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should keep the main toggle enabled', () => {
      expect(getMainToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should keep the infinity toggle unchecked', () => {
      expect(getInfinityToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should keep the infinity toggle enabled', () => {
      expect(getInfinityToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should show the numeric input with the configured min', () => {
      expect(getInput().exists()).toBe(true)
      expect(getInput().props('min')).toBe(ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN)
    })

    BddTest().then('it should keep the numeric input enabled', () => {
      expect(getInput().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the information message', () => {
      expect(getMessage().exists()).toBe(true)
    })
  })

  BddTest().when('trace associations are disabled by value', () => {
    beforeEach(() => {
      mountField(ACTIVITY_TRACE_SETTING_DISABLED_VALUE)
    })

    BddTest().then('it should render only the main toggle', () => {
      expect(getToggles()).toHaveLength(1)
    })

    BddTest().then('it should render the main toggle unchecked', () => {
      expect(getMainToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should keep the main toggle enabled', () => {
      expect(getMainToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should hide the infinity toggle', () => {
      expect(getInfinityToggle()).toBeUndefined()
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should render the information message', () => {
      expect(getMessage().exists()).toBe(true)
    })
  })
})
