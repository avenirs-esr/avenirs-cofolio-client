export const StudentTraceCardStub = defineComponent({
  name: 'StudentTraceCard',
  props: {
    trace: {
      type: Object,
      required: false
    },
    to: {
      type: [String, Object],
      required: false
    }
  },
  template: '<div class="student-trace-card-stub"></div>'
})
