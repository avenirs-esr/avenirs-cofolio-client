export const ActivitiesSelectNavigationStub = defineComponent({
  name: 'ActivitiesSelectNavigationStub',
  props: {
    isProjectRoute: {
      type: Boolean,
      default: true
    }
  },
  template: `
    <div data-testid="activities-select-navigation" />
  `
})
