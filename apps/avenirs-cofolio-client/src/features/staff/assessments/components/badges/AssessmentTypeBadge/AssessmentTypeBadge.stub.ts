import type { EActivityAssessmentType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AssessmentTypeBadgeStub = defineComponent({
  name: 'AssessmentTypeBadge',
  props: { assessmentType: { type: String as PropType<EActivityAssessmentType>, required: true } },
  template: '<div data-testid="activity-type-badge">{{ assessmentType }}</div>'
})
