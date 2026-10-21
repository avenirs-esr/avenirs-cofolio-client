export const UpdateDeclaredSkillFormStub = defineComponent({
  name: 'UpdateDeclaredSkillForm',
  props: ['declaredSkillProgressDetails', 'onSkillUpdated', 'onCancel'],
  emits: ['dirty-change'],
  template: '<div class="update-form-stub" />',
})
