export const TraceValorizationToggleStub = defineComponent({
  name: 'TraceValorizationToggle',
  props: {
    id: { type: String },
    name: { type: String },
    modelValue: { type: Boolean },
    description: { type: String },
    disabled: { type: Boolean },
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
