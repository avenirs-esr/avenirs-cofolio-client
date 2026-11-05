import type { PropType } from 'vue'
import type { EActivityAssessmentStatus } from '@/api/avenir-esr'

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
