import type { PropType } from 'vue'
import type { AlertConfigurationDTO } from '@/api/avenir-esr'

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
