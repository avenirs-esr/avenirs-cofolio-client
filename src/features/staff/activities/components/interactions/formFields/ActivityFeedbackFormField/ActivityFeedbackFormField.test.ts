import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import ActivityFeedbackFormField from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.vue'
import {
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN,
} from '@/features/staff/activities/config'
import { ToggleParameterCardStub } from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.stub'
import { AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

function createTestWrapper (
  initialValue = ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT,
  disabled = false,
) {
  return createFormFieldTestWrapper<EditActivityFormData, 'feedbackAllowedIterations'>({
    formFieldComponent: ActivityFeedbackFormField,
    fieldName: 'feedbackAllowedIterations',
    defaultValue: initialValue,
    extraProps: {
      disabled,
    },
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
    ToggleParameterCard: ToggleParameterCardStub,
    AvMessage: AvMessageStub,
  }

  const mountField = (
    initialValue = ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT,
    disabled = false,
  ) => {
    const TestWrapper = createTestWrapper(initialValue, disabled)

    wrapper = mount(TestWrapper, {
      global: { stubs },
    }) as unknown as VueWrapper<InstanceType<typeof ActivityFeedbackFormField>>
  }

  const getInput = () =>
    wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>

  const getToggleParameterCard = () =>
    wrapper.findComponent(ToggleParameterCardStub) as VueWrapper<InstanceType<typeof ToggleParameterCardStub>>

  const getInfinityToggleInput = () => wrapper.find('#feedback-infinity-toggle-input')

  const getMessage = () =>
    wrapper.findComponent(AvMessageStub) as VueWrapper<InstanceType<typeof AvMessageStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    mountField()
  })

  BddTest().when('the component is mounted with default value', () => {
    BddTest().then('it should render the parameter card', () => {
      expect(getToggleParameterCard().exists()).toBe(true)
    })

    BddTest().then('it should keep the parameter card enabled', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the infinity toggle', () => {
      expect(getInfinityToggleInput().exists()).toBe(true)
    })

    BddTest().then('it should keep the infinity toggle unchecked', () => {
      expect((getInfinityToggleInput().element as HTMLInputElement).checked).toBe(false)
    })

    BddTest().then('it should keep the infinity toggle enabled', () => {
      expect(getInfinityToggleInput().attributes('disabled')).toBeUndefined()
    })

    BddTest().then('it should render the input field', () => {
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should pass the min prop to the input', () => {
      expect(getInput().props('min')).toBe(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN)
    })

    BddTest().then('it should keep the numeric input enabled', () => {
      expect(getInput().props('disabled')).toBe(false)
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
      mountField(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT, true)
    })

    BddTest().then('it should disable the parameter card', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(true)
    })

    BddTest().then('it should disable the infinity toggle', () => {
      expect(getInfinityToggleInput().attributes('disabled')).toBeDefined()
    })

    BddTest().then('it should disable the numeric input', () => {
      expect(getInput().props('disabled')).toBe(true)
    })

    BddTest().then('it should render the disabled information message', () => {
      expect(getMessage().exists()).toBe(true)
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.',
      )
    })
  })

  BddTest().when('the field is set to infinity', () => {
    beforeEach(() => {
      mountField(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY)
    })

    BddTest().then('it should keep the infinity toggle visible', () => {
      expect(getInfinityToggleInput().exists()).toBe(true)
    })

    BddTest().then('it should keep the infinity toggle checked', () => {
      expect((getInfinityToggleInput().element as HTMLInputElement).checked).toBe(true)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should render the future disabled information message', () => {
      expect(getMessage().props('message')).toEqual(
        'Après la publication de l\'activité et suite à l\'inscription d\'un apprenant ce champ ne sera plus modifiable',
      )
    })
  })

  BddTest().when('the field is set to infinity with disabled prop', () => {
    beforeEach(() => {
      mountField(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY, true)
    })

    BddTest().then('it should disable the parameter card', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(true)
    })

    BddTest().then('it should disable the infinity toggle', () => {
      expect(getInfinityToggleInput().attributes('disabled')).toBeDefined()
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should render the disabled information message', () => {
      expect(getMessage().props('message')).toEqual(
        'Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.',
      )
    })
  })

  BddTest().when('the numeric input is cleared', () => {
    beforeEach(async () => {
      await getInput().vm.$emit('update:modelValue', '')
      await nextTick()
    })

    BddTest().then('it should keep the field enabled', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(false)
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
      expect(getMessage().exists()).toBe(true)
      expect(getMessage().props('type')).toBe('info')
      expect(getMessage().props('message')).toEqual(
        'Après la publication de l\'activité et suite à l\'inscription d\'un apprenant ce champ ne sera plus modifiable',
      )
    })
  })

  BddTest().when('feedback iterations are disabled by value with disabled prop', () => {
    beforeEach(() => {
      mountField(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED, true)
    })

    BddTest().then('it should disable the parameter card', () => {
      expect(getToggleParameterCard().props('disabled')).toBe(true)
    })

    BddTest().then('it should hide the infinity toggle', () => {
      expect(getInfinityToggleInput().exists()).toBe(false)
    })

    BddTest().then('it should hide the numeric input', () => {
      expect(getInput().exists()).toBe(false)
    })

    BddTest().then('it should render the disabled information message', () => {
      expect(getMessage().props('message')).toEqual(
        'Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.',
      )
    })
  })
})
