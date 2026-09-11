export const AssociatedElementsTabStub = defineComponent({
  name: 'AssociatedElementsTab',
  props: [
    'traceAssociationsDisabled',
    'traceAllowedAssociations',
    'readOnly',
  ],
  template: '<div data-testid="associated-elements-tab-stub" />',
})
