export const DeleteMyActivityConfirmModalStub = defineComponent({
  name: 'DeleteMyActivityConfirmModal',
  props: {
    opened: { type: Boolean, required: true },
    declaredActivityId: { type: String, required: true },
    activityId: { type: String, required: true },
    activityTitle: { type: String, required: true }
  },
  emits: ['deleted', 'cancel'],
  template: `
    <div v-if="opened" data-testid="delete-my-activity-confirm-modal-stub">
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('deleted')">Delete</button>
    </div>
  `
})
