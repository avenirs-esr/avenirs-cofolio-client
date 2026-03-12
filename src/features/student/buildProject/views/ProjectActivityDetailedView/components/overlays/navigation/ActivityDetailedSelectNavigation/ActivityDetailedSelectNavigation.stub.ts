export const ActivityDetailedSelectNavigationStub = defineComponent({
  name: 'ActivityDetailedSelectNavigationStub',
  props: ['activityTitle', 'selectedItem'],
  emits: ['update:selectedItem'],
  template: `
    <div data-testid="activity-detailed-select-navigation" />
  `,
})
