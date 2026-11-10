import type { EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
