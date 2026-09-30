export const ValorizeToggleStub = defineComponent({
  name: 'ValorizeToggle',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    id: String,
    name: String,
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  template: `
    <input
      type="checkbox"
      :id="id"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  `,
})
