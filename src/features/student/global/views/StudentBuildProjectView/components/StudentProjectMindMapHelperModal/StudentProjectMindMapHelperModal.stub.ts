export const StudentProjectMindMapHelperModalStub = defineComponent({
  name: 'StudentProjectMindMapHelperModal',
  props: ['opened', 'onClose', 'trace'],
  template: '<div v-if="opened" data-testid="student-project-mind-map-helper-modal">StudentProjectMindMapHelperModal</div>',
})
