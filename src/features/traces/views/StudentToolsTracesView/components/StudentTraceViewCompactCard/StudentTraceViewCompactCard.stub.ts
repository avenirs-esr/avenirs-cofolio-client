export const StudentTraceViewCompactCardStub = {
  name: 'StudentTraceViewCompactCard',
  props: ['trace'],
  template: `
    <div data-testid="student-trace-view-compact-card">
      {{ trace.title }}
    </div>
  `
}
