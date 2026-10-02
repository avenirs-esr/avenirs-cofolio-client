export const ConfirmationModalStub = defineComponent({
  name: 'ConfirmationModal',
  inheritAttrs: false,
  props: {
    opened: Boolean,
    title: String,
    description: String,
    showDescription: Boolean,
    closeButtonLabel: String,
    confirmButtonLabel: String,
    confirmButtonIcon: String,
    confirmButtonDisabled: Boolean,
    confirmButtonDisabledTooltip: String,
    isLoading: Boolean
  },
  emits: ['close', 'confirm'],
  template: `
    <div v-bind="$attrs">
      <slot name="header" />
      <slot>
        <div>{{ title }}</div>
        <div>{{ description }}</div>
      </slot>
    </div>
  `
})
