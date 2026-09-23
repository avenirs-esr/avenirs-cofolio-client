import type { PropType } from 'vue'

export const DatePeriodPickerStub = defineComponent({
  name: 'DatePeriodPicker',
  props: {
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    isOngoing: { type: Boolean, required: true },
    label: { type: String, default: undefined },
    ongoingLabel: { type: String, default: undefined },
    startDateErrors: { type: Array as PropType<(string | undefined)[]>, default: undefined },
    endDateErrors: { type: Array as PropType<(string | undefined)[]>, default: undefined },
    inputFormat: { type: String, default: 'yyyy-MM-dd' },
    outputFormat: { type: String, default: 'yyyy-MM-dd' },
    type: { type: String, default: 'month' },
    labelClass: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
  },
  emits: ['update:startDate', 'update:endDate', 'update:isOngoing'],
  template: '<div data-testid="date-period-picker-stub"></div>',
})
