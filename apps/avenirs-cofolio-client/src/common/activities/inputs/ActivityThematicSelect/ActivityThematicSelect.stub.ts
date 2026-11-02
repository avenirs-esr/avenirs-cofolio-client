import type { PropType } from 'vue'
import type { EActivityThematic } from '@/api/avenir-esr'

export const ActivityThematicSelectStub = defineComponent({
  name: 'ActivityThematicSelect',
  props: {
    modelValue: [String, Array] as PropType<EActivityThematic | EActivityThematic[]>,
    thematics: Array as PropType<EActivityThematic[]>,
    labelVisible: Boolean,
    multiple: Boolean,
    errorMessage: String,
    prefixIcon: String,
    required: Boolean,
  },
  emits: ['update:modelValue', 'blur'],
  template: '<div data-testid="activity-thematic-select-stub" />',
})
