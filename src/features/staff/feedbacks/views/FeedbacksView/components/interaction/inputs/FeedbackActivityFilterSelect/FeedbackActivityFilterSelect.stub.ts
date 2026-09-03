import type { EFeedbackStatus } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const FeedbackActivityFilterSelectStub = defineComponent({
  name: 'FeedbackActivityFilterSelect',
  props: {
    feedbackStatuses: Array as PropType<EFeedbackStatus[]>,
    label: String,
    disabled: Boolean,
  },
  emits: ['change'],
  setup (_, { emit, expose }) {
    function reset () {
      emit('change', undefined)
    }

    expose({ reset })
  },
  template: '<div data-testid="feedback-activity-filter-select-stub" />'
})
