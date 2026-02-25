export const CancelSubscribeActivityConfirmModalStub = defineComponent({
  name: 'CancelSubscribeActivityConfirmModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['cancel', 'confirm'],
  template: `<div v-if="show">
    <p>CancelSubscribeActivityConfirmModalStub</p>
  </div>`
})
