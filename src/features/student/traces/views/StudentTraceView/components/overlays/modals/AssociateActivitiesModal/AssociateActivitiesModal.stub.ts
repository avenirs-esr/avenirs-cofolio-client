export const AssociateActivitiesModalStub = defineComponent({
  name: 'AssociateActivitiesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    activities: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'search', 'associate'],
  template: `
    <div data-testid="associate-activities-modal-stub">
      <slot />
    </div>
  `
})
