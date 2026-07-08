export const ToggleParameterCardStub = defineComponent({
  name: 'ToggleParameterCard',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  template: '<div class="toggle-parameter-card"><slot /></div>',
})
