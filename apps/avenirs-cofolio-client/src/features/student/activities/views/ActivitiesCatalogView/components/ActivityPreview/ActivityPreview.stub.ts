import type { ActivityPresentationDTO } from '@/api/avenir-esr'

export const ActivityPreviewStub = defineComponent({
  name: 'ActivityPreviewStub',
  props: {
    activity: {
      type: Object as () => ActivityPresentationDTO,
      required: true
    }
  },
  template: `
    <div data-testid="activity-preview">
      <div v-if="activity.banner" data-testid="activity-banner">{{ activity.banner.url }}</div>
      <span data-testid="activity-title">{{ activity.title }}</span>
      <span data-testid="activity-thematic">{{ activity.thematic }}</span>
      <span data-testid="activity-summary">{{ activity.summary }}</span>
      <span data-testid="activity-recommended-completion-contexts-info">{{ activity.recommendedCompletionContexts }}</span>
    </div>
  `
})
