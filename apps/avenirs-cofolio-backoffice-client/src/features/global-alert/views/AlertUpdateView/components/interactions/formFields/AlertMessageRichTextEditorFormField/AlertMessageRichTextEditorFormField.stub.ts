import type { PropType } from 'vue'
import type { AlertUpdateForm } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'

export const AlertMessageRichTextEditorFormFieldStub = defineComponent({
  name: 'AlertMessageRichTextEditorFormField',
  props: {
    form: {
      type: Object as PropType<AlertUpdateForm>,
      required: true,
    },
  },
  template: '<div data-testid="alert-message-rich-text-editor-form-field-stub" />',
})
