export const TraceAiUsageToggleFormFieldStub = defineComponent({
  name: 'TraceAiUsageToggleFormField',
  props: {
    form: { type: Object, required: true },
  },
  emits: ['change'],
  template: '<div class="av-toggle-stub" />',
})
