import type { CguDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const TermsOfServiceUpdateFormStub = defineComponent({
  name: 'TermsOfServiceUpdateForm',
  props: {
    cgu: {
      type: Object as PropType<CguDTO>,
      required: false,
    },
  },
  emits: ['dirtyChange'],
  template: '<div data-testid="terms-of-service-update-form-stub" />',
})
