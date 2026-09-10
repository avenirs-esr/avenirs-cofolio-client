export const UnsubscribeActivitiesConfirmModalStub = defineComponent({
  name: 'UnsubscribeActivitiesConfirmModal',
  props: {
    opened: {
      type: Boolean,
      required: true
    },
    activities: {
      type: Array as () => { id: string, title: string }[],
      required: true
    },
    declaredActivityId: {
      type: String,
      required: false
    }
  },
  emits: ['unsubscribed', 'cancel'],
  template: `<div v-if="opened">
    <p>UnsubscribeActivitiesConfirmModalStub for activities: {{ activities.map(a => a.title).join(', ') }}</p>
    <button @click="$emit('cancel')">Cancel</button>
  </div>`
})
