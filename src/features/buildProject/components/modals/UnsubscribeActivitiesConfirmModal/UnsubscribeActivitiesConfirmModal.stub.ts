export const UnsubscribeActivitiesConfirmModalStub = defineComponent({
  name: 'UnsubscribeActivitiesConfirmModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    activities: {
      type: Array as () => { id: string, title: string }[],
      required: true
    }
  },
  emits: ['unsubscribed', 'cancel'],
  template: `<div v-if="show">
    <p>UnsubscribeActivitiesConfirmModalStub for activities: {{ activities.map(a => a.title).join(', ') }}</p>
    <button @click="$emit('cancel')">Cancel</button>
  </div>`
})
