export const PeriodBadgeStub = defineComponent({
  name: 'PeriodBadge',
  props: {
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: false
    }
  },
  template: '<div class="period-badge-stub">{{ startDate }} - {{ endDate || "Ongoing" }}</div>'
})
