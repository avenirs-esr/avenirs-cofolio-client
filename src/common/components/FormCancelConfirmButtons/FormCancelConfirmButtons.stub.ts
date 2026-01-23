import { AvCancelConfirmButtonsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const FormCancelConfirmButtonsStub = defineComponent({
  name: 'FormCancelConfirmButtons',
  props: ['isSubmitting', 'isFormValid', ...AvCancelConfirmButtonsStub.props],
  emits: AvCancelConfirmButtonsStub.emits,
  template: '<div data-testid="form-cancel-confirm-buttons-stub"></div>'
})
