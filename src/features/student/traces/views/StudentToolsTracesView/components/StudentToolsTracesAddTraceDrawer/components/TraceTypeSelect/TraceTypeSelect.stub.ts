export const TraceTypeSelectStub = defineComponent({
  name: 'TraceTypeSelect',
  template: `<div class="trace-type-Select"/>`,
  props: ['traceType'],
  emits: ['update:traceType']
})
