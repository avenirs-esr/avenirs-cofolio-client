import type { PropType } from 'vue'
import type { AlertUpdateForm } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'

export const AlertActiveToggleFormFieldStub = defineComponent({
  name: 'AlertActiveToggleFormField',
  props: {
    form: {
      type: Object as PropType<AlertUpdateForm>,
      required: true,
    },
  },
  template: '<div data-testid="alert-active-toggle-form-field-stub" />',
})
