export const ConfirmAssociateModalStub = defineComponent({
  name: 'ConfirmAssociateModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array as () => { id: string, title: string }[],
      required: true
    }
  },
  emits: ['confirm', 'cancel'],
  template: `<div v-if="show">
    <p>{{ title }}</p>
    <p>ConfirmAssociateModalStub for items: {{ items.map(item => item.title).join(', ') }}</p>
    <button @click="$emit('cancel')">Cancel</button>
    <button @click="$emit('confirm')">Confirm</button>
  </div>`
})
