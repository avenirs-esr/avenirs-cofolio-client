export const StudentTraceViewCompactCardStub = {
  name: 'StudentTraceViewCompactCard',
  props: ['trace'],
  template: `
    <div
      class="student-trace-card student-trace-card--compact"
      data-testid="student-trace-view-compact-card"
    >
      {{ trace.title }}
    </div>
  `
}
