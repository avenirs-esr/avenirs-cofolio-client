import type { PropType } from 'vue'
import type { AlertUpdateForm } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'

export const AlertPeriodFormFieldStub = defineComponent({
  name: 'AlertPeriodFormField',
  props: {
    form: {
      type: Object as PropType<AlertUpdateForm>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  template: '<div data-testid="alert-period-form-field-stub" />',
})
