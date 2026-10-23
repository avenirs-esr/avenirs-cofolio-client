import type { PropType } from 'vue'

export const DatePeriodPickerStub = defineComponent({
  name: 'DatePeriodPicker',
  props: {
    startDate: { type: String, required: true },
    endDate: { type: String, required: false },
    isOngoing: { type: Boolean, required: false },
    label: { type: String, default: undefined },
    labelVisible: { type: Boolean, default: true },
    ongoingLabel: { type: String, required: false },
    placeholder: { type: String, required: false },
    width: { type: String, required: false },
    startDateErrors: { type: Array as PropType<(string | undefined)[]>, default: undefined },
    endDateErrors: { type: Array as PropType<(string | undefined)[]>, default: undefined },
    inputFormat: { type: String, default: 'yyyy-MM-dd' },
    outputFormat: { type: String, default: 'yyyy-MM-dd' },
    type: { type: String, default: 'month' },
    labelClass: { type: String, default: undefined },
    minDate: { type: [Date, String, Number], required: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    showOngoing: { type: Boolean, default: true },
  },
  emits: ['update:startDate', 'update:endDate', 'update:isOngoing'],
  template: '<div data-testid="date-period-picker-stub"></div>',
})
