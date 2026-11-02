export const UnsubscribeActivitiesModalStub = defineComponent({
  name: 'UnsubscribeActivitiesModal',
  props: {
    opened: {
      type: Boolean,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
  },
  emits: ['cancel', 'unsubscribed'],
  template: '<div class="unsubscribe-activities-modal-stub" />',
})
