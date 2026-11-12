import type { AlertConfigurationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AlertUpdateFormStub = defineComponent({
  name: 'AlertUpdateForm',
  props: {
    alert: {
      type: Object as PropType<AlertConfigurationDTO>,
      required: false,
    },
  },
  emits: ['dirtyChange', 'alertUpdated', 'cancel'],
  template: '<div data-testid="alert-update-form-stub" />',
})
