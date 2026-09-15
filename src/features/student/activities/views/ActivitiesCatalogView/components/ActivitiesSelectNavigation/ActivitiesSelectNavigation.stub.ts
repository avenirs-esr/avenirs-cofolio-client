export const ActivitiesSelectNavigationStub = defineComponent({
  name: 'ActivitiesSelectNavigationStub',
  props: {
    widget: {
      type: Boolean,
      required: true
    }
  },
  template: `<div data-testid="activities-select-navigation" />`
})
