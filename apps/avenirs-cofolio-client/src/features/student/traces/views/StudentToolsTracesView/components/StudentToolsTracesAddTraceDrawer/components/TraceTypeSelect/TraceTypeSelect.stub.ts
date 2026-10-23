export const TraceTypeSelectStub = defineComponent({
  name: 'TraceTypeSelect',
  template: `<div class="trace-type-select"/>`,
  props: ['traceType'],
  emits: ['update:traceType']
})
