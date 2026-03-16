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
