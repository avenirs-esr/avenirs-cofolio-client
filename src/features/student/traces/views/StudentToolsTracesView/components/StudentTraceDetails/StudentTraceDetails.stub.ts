export const StudentTraceDetailsStub = {
  name: 'StudentTraceDetails',
  props: ['trace'],
  template: `
    <div data-testid="student-trace-details">
      {{ trace?.title }}
    </div>
  `
}
