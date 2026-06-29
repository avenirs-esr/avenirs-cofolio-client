export const ActivityCatalogPreviewCardStub = defineComponent({
  name: 'ActivityCatalogPreviewCard',
  template: '<div data-testid="activity-catalog-preview-card-stub"><slot name="actions" /></div>',
  props: {
    summary: {
      type: String,
      required: true,
    },
    executionPeriodInfo: {
      type: String,
    },
  },
})
