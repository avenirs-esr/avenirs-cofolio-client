export const ActivityDetailedSideNavigationStub = defineComponent({
  name: 'ActivityDetailedSideNavigationStub',
  props: ['activityTitle', 'selectedItem'],
  emits: ['update:selectedItem'],
  template: `
    <div data-testid="activity-detailed-side-navigation" />
  `,
})
