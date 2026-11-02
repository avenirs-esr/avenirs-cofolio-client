import type { PropType } from 'vue'
import type { EDeclaredActivityStatus } from '@/api/avenir-esr'

export const DeclaredActivityStatusSelectStub = defineComponent({
  name: 'DeclaredActivityStatusSelect',
  props: {
    modelValue: [String, Array] as PropType<EDeclaredActivityStatus | EDeclaredActivityStatus[]>,
    statuses: Array as PropType<EDeclaredActivityStatus[]>,
    labelVisible: Boolean,
  },
  emits: ['update:modelValue', 'blur'],
  template: '<div data-testid="declared-activity-status-select-stub" />',
})
