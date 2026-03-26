export const AssociateActivitiesModalStub = defineComponent({
  name: 'AssociateActivitiesModal',
  props: {
    show: Boolean,
    traceId: String
  },
  emits: ['cancel', 'associated'],
  template: '<div data-testid="associate-activities-modal-stub" />'
})
