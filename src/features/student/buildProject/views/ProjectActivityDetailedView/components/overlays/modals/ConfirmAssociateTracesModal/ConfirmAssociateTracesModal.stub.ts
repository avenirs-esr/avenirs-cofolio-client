export const ConfirmAssociateTracesModalStub = defineComponent({
  name: 'ConfirmAssociateTracesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    traces: {
      type: Array as () => { id: string, title: string }[],
      required: true
    }
  },
  emits: ['confirmed', 'cancel'],
  template: `<div v-if="show">
    <p>ConfirmAssociateTracesModalStub for traces: {{ traces.map(trace => trace.title).join(', ') }}</p>
    <button @click="$emit('cancel')">Cancel</button>
    <button @click="$emit('confirmed')">Confirm</button>
  </div>`
})
