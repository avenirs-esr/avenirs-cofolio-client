export const StudentDetailedTraceModalStub = defineComponent({
  name: 'StudentDetailedTraceModal',
  props: ['showModal', 'onClose', 'trace'],
  template: `
    <div v-if="showModal" data-testid="student-detailed-trace-modal">
      StudentDetailedTraceModal
    </div>
  `,
})
