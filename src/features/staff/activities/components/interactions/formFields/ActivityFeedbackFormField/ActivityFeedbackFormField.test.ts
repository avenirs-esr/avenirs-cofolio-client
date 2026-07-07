import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import ActivityFeedbackFormField from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.vue'
import {
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN,
} from '@/features/staff/activities/config'
import { IconTitleCardContainerStub } from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

function createTestWrapper (initialValue = ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT) {
  return createFormFieldTestWrapper<EditActivityFormData, 'feedbackAllowedIterations'>({
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
    IconTitleCardContainer: IconTitleCardContainerStub,
    Toggle: ToggleStub,
    AvMessage: AvMessageStub,
  }

  const mountField = (
    initialValue = ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT,
    disabled = false,
  ) => {
    const TestWrapper = createTestWrapper(initialValue)

    wrapper = mount(TestWrapper, {
      props: {
        disabled,
      },
      global: { stubs },
    }) as unknown as VueWrapper<InstanceType<typeof ActivityFeedbackFormField>>
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

  BddTest().when('the component is mounted with default value', () => {
    BddTest().then('it should render the input field', () => {
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should render the infinity toggle', () => {
      expect(getInfinityToggle().exists()).toBe(true)
    })

    BddTest().then('it should pass the min prop to the input', () => {
      expect(getInput().props('min')).toBe(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN)
    })

    BddTest().then('it should keep the main toggle checked', () => {
      expect(getMainToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should keep the main toggle enabled', () => {
      expect(getMainToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should keep the infinity toggle enabled', () => {
      expect(getInfinityToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should keep the numeric input enabled', () => {
      expect(getInput().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the information message', () => {
      expect(getMessage().exists()).toBe(true)
    })

    BddTest().then('it should render the information message as info', () => {
      expect(getMessage().props('type')).toBe('info')
    })

    BddTest().then('it should pass the disabled information message', () => {
      expect(getMessage().props('message')).toEqual({
        title: 'Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.',
      })
    })
  })

  BddTest().when('the field is set to infinity', () => {
    beforeEach(() => {
      mountField(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY)
    })

    BddTest().then('it should keep the infinity toggle visible', () => {
      expect(getInfinityToggle().exists()).toBe(true)
    })

    BddTest().then('it should keep the infinity toggle checked', () => {
      expect(getInfinityToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })
  })

  BddTest().when('the numeric input is cleared', () => {
    beforeEach(async () => {
      await getInput().vm.$emit('update:modelValue', '')
      await nextTick()
    })

    BddTest().then('it should keep the field enabled', () => {
      expect(getMainToggle().props('modelValue')).toBe(true)
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should show an input error', () => {
      expect(getInput().props('errorMessage')).toBeTruthy()
    })
  })

  BddTest().when('feedback iterations are disabled by value', () => {
    beforeEach(() => {
      mountField(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED)
    })

    BddTest().then('it should hide the infinity toggle', () => {
      expect(getToggles()).toHaveLength(1)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should render the main toggle unchecked', () => {
      expect(getMainToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should keep the main toggle enabled', () => {
      expect(getMainToggle().props('disabled')).toBe(false)
    })
  })
})
