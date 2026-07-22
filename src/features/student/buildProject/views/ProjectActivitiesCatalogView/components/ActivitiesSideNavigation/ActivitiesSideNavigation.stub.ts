export const ActivitiesSideNavigationStub = defineComponent({
  name: 'ActivitiesSideNavigationStub',
  props: {
    isProjectRoute: {
      type: Boolean,
      default: true
    }
  },
  template: `
    <div data-testid="activities-side-navigation" />
  `
})
