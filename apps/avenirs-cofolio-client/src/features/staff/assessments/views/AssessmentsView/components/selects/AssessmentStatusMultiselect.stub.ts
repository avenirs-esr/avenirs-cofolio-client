import type { PropType } from 'vue'

export const AssessmentStatusMultiselectStub = defineComponent({
  name: 'AssessmentStatusMultiselect',
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="assessment-status-multiselect-stub" />',
})
