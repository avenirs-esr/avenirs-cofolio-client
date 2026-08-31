export const TraceAiUsageToggleStub = defineComponent({
  name: 'TraceAiUsageToggle',
  props: {
    modelValue: { type: Boolean },
    description: { type: String },
    disabled: { type: Boolean },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="trace-ai-usage-toggle-stub"></div>',
})
