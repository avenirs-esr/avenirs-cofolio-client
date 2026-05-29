export const ToggleParameterCardStub = defineComponent({
  name: 'ToggleParameterCard',
  props: {
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
  template: '<div class="toggle-parameter-card"><slot /></div>',
})
