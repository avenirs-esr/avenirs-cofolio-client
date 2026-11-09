import type { EActivityAssessmentStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AssessmentStatusMultiselectStub = defineComponent({
  name: 'AssessmentStatusMultiselect',
  props: {
    modelValue: {
      type: Array as PropType<EActivityAssessmentStatus[]>,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="assessment-status-multiselect-stub" />',
})
