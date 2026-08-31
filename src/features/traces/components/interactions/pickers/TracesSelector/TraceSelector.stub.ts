export const TracesSelectorStub = {
  name: 'TracesSelector',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    traces: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  template: `
    <div data-testid="traces-selector">
      <div
        v-for="trace in traces"
        :key="trace.id"
        data-testid="trace-item"
      >
        {{ trace.title }}
      </div>

      <button
        data-testid="select-traces"
        @click="$emit('update:modelValue', traces.map(trace => trace.id))"
      >
        Select all
      </button>
    </div>
  `
}
