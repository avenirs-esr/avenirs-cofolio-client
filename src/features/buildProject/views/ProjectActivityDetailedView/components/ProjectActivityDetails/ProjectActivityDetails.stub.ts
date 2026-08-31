import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'

export const ProjectActivityDetailsStub = defineComponent({
  name: 'ProjectActivityDetailsStub',
  props: {
    declaredActivityDetails: {
      type: Object as () => DeclaredActivityDetailsDTO,
      required: true
    }
  },
  template: `
    <div data-testid="project-activity-details">
      <span data-testid="activity-title">
        {{ declaredActivityDetails.activity.title }}
      </span>

      <span data-testid="activity-description">
        {{ declaredActivityDetails.activity.description }}
      </span>

      <span data-testid="activity-recommended-completion-contexts-info">
        {{ declaredActivityDetails.activity.recommendedCompletionContexts }}
      </span>
    </div>
  `
})
