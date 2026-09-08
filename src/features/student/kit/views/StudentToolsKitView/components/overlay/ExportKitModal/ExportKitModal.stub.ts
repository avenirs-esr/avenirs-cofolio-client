export const ExportKitModalStub = defineComponent({
  name: 'ExportKitModal',
  props: {
    opened: { type: Boolean, required: true },
  },
  emits: ['close'],
  template: '<div data-testid="export-kit-modal" />',
})
