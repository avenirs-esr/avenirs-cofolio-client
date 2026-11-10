import type { PropType } from 'vue'
import type { CguDTO } from '@/api/avenir-esr'

export const TermsOfServiceUpdateFormStub = defineComponent({
  name: 'TermsOfServiceUpdateForm',
  props: {
    cgu: {
      type: Object as PropType<CguDTO>,
      required: false,
    },
  },
  emits: ['dirtyChange', 'termsOfServiceUpdated'],
  template: '<div data-testid="terms-of-service-update-form-stub" />',
})
