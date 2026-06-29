import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import ActivityTraceFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.vue'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN, ACTIVITY_TRACE_SETTING_DISABLED_VALUE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const TestWrapper = createFormFieldTestWrapper<EditActivityFormData, 'traceAllowedAssociations'>({
  formFieldComponent: ActivityTraceFormField,
  fieldName: 'traceAllowedAssociations',
  defaultValue: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
  useValidator: () => () => undefined,
})

BddTest().given('an ActivityTraceFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityTraceFormField>>

  const stubs = {
    Input: InputStub,
    Toggle: ToggleStub,
  }

  const getField = () => wrapper.findComponent(ActivityTraceFormField)
  const getInput = () => wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>
  const getToggles = () => wrapper.findAllComponents(ToggleStub) as Array<VueWrapper<InstanceType<typeof ToggleStub>>>
  const getMainToggle = () => getToggles()[0]
  const getInfinityToggle = () => getToggles()[1]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    wrapper = mount(TestWrapper, { global: { stubs } }) as unknown as VueWrapper<InstanceType<typeof ActivityTraceFormField>>
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main and infinity toggles', () => {
      expect(getToggles()).toHaveLength(2)
    })

    BddTest().then('it should have the main toggle enabled by default', () => {
      expect(getMainToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should hide the numeric input when value is infinity', () => {
      expect(getInput().exists()).toBe(false)
    })
  })

  BddTest().when('the infinity toggle is disabled', () => {
    beforeEach(async () => {
      await getInfinityToggle().find('input').setValue(false)
      await nextTick()
    })

    BddTest().then('it should keep the main toggle checked', () => {
      expect(getMainToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should keep infinity toggle visible and unchecked', () => {
      expect(getToggles()).toHaveLength(2)
      expect(getInfinityToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should show the numeric input with the configured min', () => {
      expect(getInput().exists()).toBe(true)
      expect(getInput().props('min')).toBe(ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN)
    })

    BddTest().then('it should autosave the min value after debounce', async () => {
      await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE)
      expect(getField().emitted('autosave')?.at(-1)).toEqual([{ traceAllowedAssociations: ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN }])
    })
  })

  BddTest().when('the main toggle is disabled', () => {
    beforeEach(async () => {
      await getMainToggle().find('input').setValue(false)
      await nextTick()
    })

    BddTest().then('it should disable the card toggle', () => {
      expect(getMainToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should hide infinity toggle and numeric input', () => {
      expect(getToggles()).toHaveLength(1)
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should autosave the disabled value after debounce', async () => {
      await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE)
      expect(getField().emitted('autosave')?.at(-1)).toEqual([{ traceAllowedAssociations: ACTIVITY_TRACE_SETTING_DISABLED_VALUE }])
    })
  })
})
