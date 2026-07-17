import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import ActivitySummaryFormField from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.vue'
import { ACTIVITY_SUMMARY_MAX_LENGTH } from '@/features/staff/activities/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<EditActivityFormData, 'summary'>({
  formFieldComponent: ActivitySummaryFormField,
  fieldName: 'summary',
  defaultValue: '',
  useValidator: () =>
    (value: string) => {
      const { validateRequired, validateMaxLength } = useFormValidators()
      return validateRequired(value) || validateMaxLength(value, ACTIVITY_SUMMARY_MAX_LENGTH)
    },
})

BddTest().given('an ActivitySummaryFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = { Input: InputStub }

  const getInput = () => wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>
  const getSummaryFormField = () => wrapper.findComponent(ActivitySummaryFormField)

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the Input component', () => {
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should have an empty initial model value', () => {
      expect(getInput().props('modelValue')).toBe('')
    })

    BddTest().then('it should pass the max length to the input', () => {
      expect(getInput().props('maxlength')).toBe(ACTIVITY_SUMMARY_MAX_LENGTH)
    })

    BddTest().then('it should render as a textarea', () => {
      expect(getInput().props('isTextarea')).toBe('')
    })

    BddTest().then('it should have no initial error message', () => {
      expect(getInput().props('errorMessage')).toBe('')
    })
  })

  BddTest().when('the input emits a valid value', () => {
    beforeEach(async () => {
      getInput().vm.$emit('update:modelValue', 'Mon resume')
    })

    BddTest().then('it should update the model value', async () => {
      await vi.waitFor(() => expect(getInput().props('modelValue')).toBe('Mon resume'))
    })

    BddTest().then('it should emit autosave with summary payload', () => {
      expect(getSummaryFormField().emitted('autosave')).toEqual([[{ summary: 'Mon resume' }]])
    })

    BddTest().then('it should not show an error message', async () => {
      await vi.waitFor(() => expect(getInput().props('errorMessage')).toBeFalsy())
    })
  })

  BddTest().when('the input emits an empty value', () => {
    beforeEach(async () => {
      getInput().vm.$emit('update:modelValue', '')
    })

    BddTest().then('it should show a required error message', async () => {
      await vi.waitFor(() => expect(getInput().props('errorMessage')).toBe('Ce champ est requis.'))
    })

    BddTest().then('it should not emit autosave', () => {
      expect(getSummaryFormField().emitted('autosave')).toBeFalsy()
    })
  })

  BddTest().when('the input emits a value exceeding the max length', () => {
    beforeEach(async () => {
      getInput().vm.$emit('update:modelValue', 'a'.repeat(ACTIVITY_SUMMARY_MAX_LENGTH + 1))
    })

    BddTest().then('it should show a max length error message', async () => {
      await vi.waitFor(() => {
        expect(getInput().props('errorMessage')).toBe(`Veuillez limiter votre saisie à ${ACTIVITY_SUMMARY_MAX_LENGTH} caractères`)
      })
    })

    BddTest().then('it should not emit autosave', () => {
      expect(getSummaryFormField().emitted('autosave')).toBeFalsy()
    })
  })
})
