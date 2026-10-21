export const ActivitiesPreviousNextNavigationStub = defineComponent({
  name: 'ActivitiesPreviousNextNavigationStub',
  props: {
    widget: {
      type: Boolean,
      required: true
    }
  },
  template: `<div data-testid="activities-previous-next-navigation" />`
})
