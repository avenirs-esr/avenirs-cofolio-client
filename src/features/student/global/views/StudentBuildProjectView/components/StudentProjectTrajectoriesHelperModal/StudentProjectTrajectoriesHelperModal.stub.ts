export const StudentProjectTrajectoriesHelperModalStub = defineComponent({
  name: 'StudentProjectTrajectoriesHelperModal',
  props: ['opened', 'onClose', 'trace'],
  template: '<div v-if="opened" data-testid="student-project-trajectories-helper-modal">StudentProjectTrajectoriesHelperModal</div>',
})
