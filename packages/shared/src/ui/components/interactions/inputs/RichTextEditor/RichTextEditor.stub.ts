import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const RichTextEditorStub = defineComponent({
  name: 'RichTextEditor',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    charCount: {
      type: Number,
      default: 0,
    },
    maxlength: {
      type: Number,
      default: undefined,
    },
    errorMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    allowedHeadersLevels: {
      type: Array as PropType<number[]>,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'update:charCount'],
  template: `
    <div class="rich-text-editor">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value); $emit('update:charCount', $event.target.value.length)"
      />
    </div>`
})
