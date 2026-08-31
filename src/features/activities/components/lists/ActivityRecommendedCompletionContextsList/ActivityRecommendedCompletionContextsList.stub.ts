export const ActivityRecommendedCompletionContextsListStub
  = defineComponent({
    name: 'ActivityRecommendedCompletionContextsListStub',
    props: {
      recommendedCompletionContexts: {
        type: String,
        required: true
      }
    },
    template: `
      <ul data-testid="activity-recommended-completion-contexts-list">
        <li>{{ recommendedCompletionContexts }}</li>
      </ul>
    `
  })
