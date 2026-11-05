import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { AlertUpdateFormData } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createFormFieldTestWrapper } from '@avenirs-esr/shared/test-utils/unit'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { AlertMessageRichTextEditorStub } from '@/features/global-alert/components/interactions/inputs/AlertMessageRichTextEditor/AlertMessageRichTextEditor.stub'
import AlertMessageRichTextEditorFormField from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertMessageRichTextEditorFormField/AlertMessageRichTextEditorFormField.vue'
import { useUpdateAlertFormValidators } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form-validators/use-update-alert-form-validators'

const DEFAULT_MESSAGE = '<p>Maintenance prévue ce soir</p>'
const EMPTY_EDITOR_VALUE = '<p></p>'

type MountingOptions = ComponentMountingOptions<typeof AlertMessageRichTextEditorFormField>
type FieldProps = Omit<MountingOptions['props'], 'form'>

function createTestWrapper (extraProps?: FieldProps) {
  return createFormFieldTestWrapper<AlertUpdateFormData, 'message'>({
    formFieldComponent: AlertMessageRichTextEditorFormField,
    fieldName: 'message',
    defaultValue: DEFAULT_MESSAGE,
    useValidator: () => useUpdateAlertFormValidators().validateMessage,
    extraProps,
  })
}

BddTest().given('an AlertMessageRichTextEditorFormField component', () => {
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof createTestWrapper>>>

  const stubs = {
    AlertMessageRichTextEditor: AlertMessageRichTextEditorStub
  }

  const mountWith = (extraProps?: FieldProps) => {
    wrapper = mount(createTestWrapper(extraProps), {
      global: { stubs }
    })
  }

  const getEditor = () => wrapper.findComponent(AlertMessageRichTextEditorStub)

  beforeEach(() => {
    mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should configure the editor', () => {
      expect(getEditor().attributes('id')).toBe('message')
      expect(getEditor().props('modelValue')).toBe(DEFAULT_MESSAGE)
    })
  })

  BddTest().when('the component receives attributes', () => {
    const customClass = 'custom-class'

    beforeEach(() => {
      mountWith({
        class: customClass
      })
    })

    BddTest().then('it should forward them to the editor', () => {
      expect(getEditor().classes()).toContain(customClass)
    })
  })

  BddTest().when('the editor emits a new value', () => {
    const newMessage = '<p>Maintenance reportée à demain</p>'

    beforeEach(() => {
      getEditor().vm.$emit('update:modelValue', newMessage)
    })

    BddTest().then('it should update the field value', async () => {
      await vi.waitFor(() => {
        expect(getEditor().props('modelValue')).toBe(newMessage)
      })
    })
  })

  BddTest().when('the editor is cleared', () => {
    beforeEach(() => {
      getEditor().vm.$emit('update:modelValue', EMPTY_EDITOR_VALUE)
    })

    BddTest().then('it should empty the field value', async () => {
      await vi.waitFor(() => {
        expect(getEditor().props('modelValue')).toBe('')
      })
    })
  })

  BddTest().when('the form is submitted with a cleared message', () => {
    beforeEach(async () => {
      getEditor().vm.$emit('update:modelValue', EMPTY_EDITOR_VALUE)
      await wrapper.find('form').trigger('submit')
    })

    BddTest().then('it should display the validation error', async () => {
      await vi.waitFor(() => {
        expect(getEditor().props('errorMessage')).toBeTruthy()
      })
    })
  })
})
