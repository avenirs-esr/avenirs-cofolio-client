export const StudentTraceDetailsStub = defineComponent({
  name: 'StudentTraceDetails',
  props: ['trace', 'hideValorizedBadge', 'disableRowLayout'],
  template: `
    <div data-testid="student-trace-details">
      {{ trace?.title }}
    </div>
  `
})
