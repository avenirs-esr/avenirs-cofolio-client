import type { EditActivityFormData } from '@/features/activities/types/forms.types'
import { RichTextEditorStub } from '@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.stub'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import ActivityConsignFormField from '@/features/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.vue'
import { ACTIVITY_CONSIGN_MAX_LENGTH } from '@/features/activities/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<EditActivityFormData, 'description'>({
  formFieldComponent: ActivityConsignFormField,
  fieldName: 'description',
  defaultValue: '',
  useValidator: () =>
    (value: string) => {
      return useFormValidators().validateMaxLength(value, ACTIVITY_CONSIGN_MAX_LENGTH)
    }

})

BddTest().given('an ActivityConsignFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = { RichTextEditor: RichTextEditorStub }

  const getEditor = () => wrapper.findComponent(RichTextEditorStub) as VueWrapper<InstanceType<typeof RichTextEditorStub>>

  const emitEditorValue = (value: string) => {
    getEditor().vm.$emit('update:charCount', value.length)
    getEditor().vm.$emit('update:modelValue', value)
  }

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
      expect(getEditor().props('maxlength')).toBe(ACTIVITY_CONSIGN_MAX_LENGTH)
    })

    BddTest().then('it should have no initial error message', () => {
      expect(getEditor().props('errorMessage')).toBeFalsy()
    })
  })

  BddTest().when('the editor emits a valid value', () => {
    beforeEach(() => {
      emitEditorValue('Ma consigne')
    })

    BddTest().then('it should update the model value', async () => {
      await vi.waitFor(() => expect(getEditor().props('modelValue')).toBe('Ma consigne'))
    })

    BddTest().then('it should not show an error message', async () => {
      await vi.waitFor(() => expect(getEditor().props('errorMessage')).toBeFalsy())
    })
  })

  BddTest().when('the editor emits content while the char count is greater than zero', () => {
    beforeEach(() => {
      emitEditorValue('<p>Ma consigne</p>')
    })

    BddTest().then('it should keep the emitted content', async () => {
      await vi.waitFor(() => expect(getEditor().props('modelValue')).toBe('<p>Ma consigne</p>'))
    })
  })

  BddTest().when('the editor emits a value but the char count is zero', () => {
    beforeEach(() => {
      getEditor().vm.$emit('update:charCount', 0)
      getEditor().vm.$emit('update:modelValue', '<p></p>')
    })

    BddTest().then('it should reset the model value to empty', async () => {
      await vi.waitFor(() => expect(getEditor().props('modelValue')).toBe(''))
    })
  })
})
