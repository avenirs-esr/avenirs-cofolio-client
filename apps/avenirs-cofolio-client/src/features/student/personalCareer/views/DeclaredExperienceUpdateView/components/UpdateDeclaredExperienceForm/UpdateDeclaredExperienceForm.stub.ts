export const UpdateDeclaredExperienceFormStub = defineComponent({
  name: 'UpdateDeclaredExperienceForm',
  props: [
    'declaredExperience',
    'onExperienceUpdated',
    'onCancel'
  ],
  emits: ['dirtyChange', 'cancel', 'experience-updated'],
  template: '<div data-testid="update-declared-experience-form-stub"></div>'
})
