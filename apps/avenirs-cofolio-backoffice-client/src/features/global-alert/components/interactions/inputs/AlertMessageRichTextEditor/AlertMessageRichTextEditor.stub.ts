import type { PropType } from 'vue'

export const AlertMessageRichTextEditorStub = defineComponent({
  name: 'AlertMessageRichTextEditor',
  props: {
    modelValue: {
      type: String,
      default: undefined,
    },
    errorMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="alert-message-rich-text-editor-stub" />',
})
