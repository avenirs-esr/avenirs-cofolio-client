export const InactiveStudentsDetailsCardStub = defineComponent({
  name: 'InactiveStudentsDetailsCard',
  props: {
    activityId: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="inactive-students-details-card-stub"></div>',
})
