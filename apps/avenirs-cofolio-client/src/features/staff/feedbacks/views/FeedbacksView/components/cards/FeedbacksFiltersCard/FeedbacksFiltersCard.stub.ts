export const FeedbacksFiltersCardStub = defineComponent({
  name: 'FeedbacksFiltersCard',
  props: {
    defaultActivityId: String,
  },
  emits: ['selectedActivityChange'],
  template: '<div data-testid="feedbacks-filters-card-stub" />'
})
