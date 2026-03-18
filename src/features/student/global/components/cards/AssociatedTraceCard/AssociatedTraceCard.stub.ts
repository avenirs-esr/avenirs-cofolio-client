export const AssociatedTraceCardStub = defineComponent({
  name: 'AssociatedTraceCard',
  props: {
    title: {
      type: String,
      required: true
    },
    to: {
      type: [String, Object],
      required: true
    }
  },
  template: '<div data-testid="associated-trace-card"></div>'
})
