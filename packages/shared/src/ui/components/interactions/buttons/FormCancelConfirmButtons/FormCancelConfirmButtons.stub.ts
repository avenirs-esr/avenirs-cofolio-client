import { AvCancelConfirmButtonsStubDefinition } from '@avenirs-esr/avenirs-dsav/test-utils'
import { defineComponent } from 'vue'

export const FormCancelConfirmButtonsStub = defineComponent({
  name: 'FormCancelConfirmButtons',
  props: {
    isSubmitting: Boolean,
    isFormValid: Boolean,
    ...AvCancelConfirmButtonsStubDefinition.props
  },
  emits: AvCancelConfirmButtonsStubDefinition.emits,
  template: '<div data-testid="form-cancel-confirm-buttons-stub"></div>'
})
