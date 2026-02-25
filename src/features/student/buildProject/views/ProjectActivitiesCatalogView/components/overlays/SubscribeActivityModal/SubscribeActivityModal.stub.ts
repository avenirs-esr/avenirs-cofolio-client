export const SubscribeActivityModalStub = defineComponent({
  name: 'SubscribeActivityModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    activity: {
      type: Object as () => { id: string, title: string },
      required: true
    }
  },
  emits: ['subscribed', 'cancel'],
  template: `<div v-if="show">
    <p>SubscribeActivityModalStub for activity: {{ activity.title }}</p>
  </div>`
})
