export const TraceTypeSelectorContainerStub = defineComponent({
  name: 'TraceTypeSelectorContainer',
  template: `<div class="trace-type-selector-container"/>`,
  props: ['traceType'],
  emits: ['update:traceType']
})
