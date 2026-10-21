export const DeclaredProgramUpdateFormStub = defineComponent({
  name: 'DeclaredProgramUpdateForm',
  props: ['declaredProgramDetailed'],
  emits: ['dirtyChange', 'programUpdated', 'cancel'],
  template: '<div data-testid="declared-program-update-form-stub" />'
})
