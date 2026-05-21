import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { RichTextEditorStub } from '@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.stub'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import ActivityExecutionPeriodFormField from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import { ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH } from '@/features/staff/activities/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<EditActivityFormData, EditActivityFormData, 'executionPeriodInfo'>({
  formFieldComponent: ActivityExecutionPeriodFormField,
  fieldName: 'executionPeriodInfo',
  defaultValue: '',
  useValidator: () =>
    (value: string) => {
      return useFormValidators().validateMaxLength(value, ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH)
    }

})

BddTest().given('an ActivityExecutionPeriodFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = { RichTextEditor: RichTextEditorStub }

  const getEditor = () => wrapper.findComponent(RichTextEditorStub) as VueWrapper<InstanceType<typeof RichTextEditorStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the RichTextEditor', () => {
      expect(getEditor().exists()).toBe(true)
    })

    BddTest().then('it should have an empty initial model value', () => {
      expect(getEditor().props('modelValue')).toBe('')
    })

    BddTest().then('it should pass the max length to the editor', () => {
      expect(getEditor().props('maxlength')).toBe(ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH)
    })

    BddTest().then('it should have no initial error message', () => {
      expect(getEditor().props('errorMessage')).toBeFalsy()
    })
  })

  BddTest().when('the editor emits a valid value', () => {
    beforeEach(() => {
      getEditor().vm.$emit('update:modelValue', 'Ma consigne')
    })

    BddTest().then('it should update the model value', async () => {
      await vi.waitFor(() => expect(getEditor().props('modelValue')).toBe('Ma consigne'))
    })

    BddTest().then('it should not show an error message', async () => {
      await vi.waitFor(() => expect(getEditor().props('errorMessage')).toBeFalsy())
    })
  })

  BddTest().when('the editor emits a value exceeding the max length', () => {
    beforeEach(async () => {
      getEditor().vm.$emit('update:modelValue', 'a'.repeat(ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH + 1))
    })

    BddTest().then('it should show a max length error message', async () => {
      await vi.waitFor(() => {
        expect(getEditor().props('errorMessage')).toBe(`Veuillez limiter votre saisie à ${ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH} caractères`)
      })
    })
  })
})
