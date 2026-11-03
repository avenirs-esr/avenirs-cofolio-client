import type { PropType } from 'vue'
import type { EActivityAssessmentType } from '@/api/avenir-esr'

export const AssessmentTypeBadgeStub = defineComponent({
  name: 'AssessmentTypeBadge',
  props: { assessmentType: { type: String as PropType<EActivityAssessmentType>, required: true } },
  template: '<div data-testid="activity-type-badge">{{ assessmentType }}</div>'
})
