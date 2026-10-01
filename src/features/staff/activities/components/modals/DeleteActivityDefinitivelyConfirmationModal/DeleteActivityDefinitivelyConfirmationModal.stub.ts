import type { EActivityStatus } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteActivityDefinitivelyConfirmationModalStub = defineComponent({
  name: 'DeleteActivityDefinitivelyConfirmationModal',
  template: '<div data-testid="delete-activity-definitively-confirmation-modal-stub"></div>',
  props: {
    opened: {
      type: Boolean,
    },
    activityId: {
      type: String,
    },
    activityStatus: {
      type: String as PropType<EActivityStatus>,
    },
  },
  emits: ['close', 'deleted'],
})
