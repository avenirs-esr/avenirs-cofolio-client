import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import ActivityFeedbackFormField from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.vue'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN } from '@/features/staff/activities/config'
import { FormFieldCardContainerStub } from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

function createTestWrapper (initialValue = ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT) {
  return createFormFieldTestWrapper<EditActivityFormData, EditActivityFormData, 'feedbackAllowedIterations'>({
    formFieldComponent: ActivityFeedbackFormField,
    fieldName: 'feedbackAllowedIterations',
    defaultValue: initialValue,
    useValidator: () =>
      (value: number | undefined) => {
        const { validateMin } = useFormValidators()
        return validateMin(value, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN)
      },
  })
}

BddTest().given('an ActivityFeedbackFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbackFormField>>

  const stubs = {
    Input: InputStub,
    FormFieldCardContainer: FormFieldCardContainerStub,
    Toggle: ToggleStub,
  }

  const mountField = (initialValue = ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT) => {
    const TestWrapper = createTestWrapper(initialValue)
    wrapper = mount(TestWrapper, { global: { stubs } }) as unknown as VueWrapper<InstanceType<typeof ActivityFeedbackFormField>>
  }

  const getField = () => wrapper.findComponent(ActivityFeedbackFormField)
  const getInput = () => wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>
  const getToggles = () => wrapper.findAllComponents(ToggleStub) as Array<VueWrapper<InstanceType<typeof ToggleStub>>>
  const getMainToggle = () => getToggles()[0]
  const getInfinityToggle = () => getToggles()[1]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mountField()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the input field', () => {
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should render the infinity toggle', () => {
      expect(getInfinityToggle().exists()).toBe(true)
    })

    BddTest().then('it should pass the min prop to the input', () => {
      expect(getInput().props('min')).toBe(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN)
    })
  })

  BddTest().when('the toggle is disabled', () => {
    beforeEach(async () => {
      await getMainToggle().find('input').setValue(false)
      await nextTick()
    })

    BddTest().then('it should reset the value to the disabled value', () => {
      expect(getMainToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should hide the infinity toggle', () => {
      expect(getToggles()).toHaveLength(1)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(wrapper.findComponent(InputStub).exists()).toBe(false)
    })

    BddTest().then('it should autosave zero after the debounce delay', async () => {
      await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE)
      expect(getField().emitted('autosave')?.at(-1)).toEqual([{ feedbackAllowedIterations: 0 }])
    })
  })

  BddTest().when('the field is set to infinity', () => {
    beforeEach(() => {
      mountField(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY)
    })

    BddTest().then('it should keep the infinity toggle visible', () => {
      expect(getInfinityToggle().exists()).toBe(true)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })
  })

  BddTest().when('the field is disabled', () => {
    beforeEach(() => {
      mountField(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED)
    })

    BddTest().then('it should hide the infinity toggle', () => {
      expect(getToggles()).toHaveLength(1)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })
  })
})
