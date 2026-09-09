export const StudentProjectTrajectoriesHelperModalStub = defineComponent({
  name: 'StudentProjectTrajectoriesHelperModal',
  props: ['modalOpened', 'onClose', 'trace'],
  template: '<div v-if="modalOpened" data-testid="student-project-trajectories-helper-modal">StudentProjectTrajectoriesHelperModal</div>',
})
