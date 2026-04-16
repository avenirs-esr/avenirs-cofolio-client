import type { ActivityDetailsDTO } from '@/api/avenir-esr'

export const ActivityPreviewStub = defineComponent({
  name: 'ActivityPreviewStub',
  props: {
    activity: {
      type: Object as () => ActivityDetailsDTO,
      required: true
    }
  },
  template: `
    <div data-testid="activity-preview">
      <div v-if="activity.banner" data-testid="activity-banner">{{ activity.banner.url }}</div>
      <span data-testid="activity-title">{{ activity.title }}</span>
      <span data-testid="activity-thematic">{{ activity.thematic }}</span>
      <span data-testid="activity-summary">{{ activity.summary }}</span>
      <span data-testid="activity-execution-period-info">{{ activity.executionPeriodInfo }}</span>
    </div>
  `
})
