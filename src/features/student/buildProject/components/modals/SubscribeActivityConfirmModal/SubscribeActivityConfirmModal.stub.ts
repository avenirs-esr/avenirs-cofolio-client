export const SubscribeActivityConfirmModalStub = defineComponent({
  name: 'SubscribeActivityConfirmModal',
  props: {
    opened: {
      type: Boolean,
      required: true
    },
    activity: {
      type: Object as () => { id: string, title: string },
      required: true
    }
  },
  emits: ['subscribed', 'cancel'],
  template: `<div v-if="opened">
    <p>SubscribeActivityConfirmModalStub for activity: {{ activity.title }}</p>
  </div>`
})
