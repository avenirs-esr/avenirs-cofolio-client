export const ActivitiesPreviousNextNavigationStub = defineComponent({
  name: 'ActivitiesPreviousNextNavigationStub',
  props: {
    isProjectRoute: {
      type: Boolean,
      default: true
    }
  },
  template: `
    <div data-testid="activities-previous-next-navigation" />
  `
})
