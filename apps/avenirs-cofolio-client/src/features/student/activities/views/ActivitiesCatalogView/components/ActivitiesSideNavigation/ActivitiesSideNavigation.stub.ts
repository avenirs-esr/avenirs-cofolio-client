export const ActivitiesSideNavigationStub = defineComponent({
  name: 'ActivitiesSideNavigationStub',
  props: {
    widget: {
      type: Boolean,
      required: true
    }
  },
  template: `<div data-testid="activities-side-navigation" />`
})
