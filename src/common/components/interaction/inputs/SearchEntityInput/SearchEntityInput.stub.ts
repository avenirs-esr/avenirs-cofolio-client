export const SearchEntityInputStub = defineComponent({
  name: 'SearchEntityInput',
  props: {
    entityName: {
      type: String,
      required: true,
    },
    entityPlaceholder: {
      type: String,
      required: false,
    },
    modelValue: {
      type: [String, Number, null],
      default: '',
    }
  },
  emits: ['update:modelValue'],
  template: `<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
})
