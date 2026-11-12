import type { DateArg } from 'date-fns'
import type { PropType } from 'vue'

export const AlertStatusBadgeStub = defineComponent({
  name: 'AlertStatusBadge',
  props: {
    active: {
      type: Boolean,
      required: false
    },
    startDate: {
      type: [Date, Number, String] as PropType<DateArg<Date>>,
      required: false
    },
    endDate: {
      type: [Date, Number, String] as PropType<DateArg<Date>>,
      required: false
    }
  },
  template: '<div data-testid="alert-status-badge-stub"></div>'
})
