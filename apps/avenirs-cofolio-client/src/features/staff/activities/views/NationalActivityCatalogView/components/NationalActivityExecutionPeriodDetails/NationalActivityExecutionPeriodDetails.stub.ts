export const NationalActivityExecutionPeriodDetailsStub = defineComponent({
  name: 'NationalActivityExecutionPeriodDetails',
  props: {
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  template: '<div data-testid="national-activity-execution-period-details-stub"></div>',
})
