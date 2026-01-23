export const FormCancelConfirmButtonsStub = defineComponent({
  name: 'FormCancelConfirmButtons',
  props: ['isSubmitting', 'isFormValid', 'cancelLabel', 'confirmLabel'],
  emits: ['handleCancel', 'handleSubmit'],
  template: '<div data-testid="form-cancel-confirm-buttons-stub"></div>'
})
