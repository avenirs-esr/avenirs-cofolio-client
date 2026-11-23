import type { ActivityContentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const EditPublishedActivityConfirmationModalStub = defineComponent({
  name: 'EditPublishedActivityConfirmationModal',
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    activity: {
      type: Object as PropType<ActivityContentDTO>,
      required: true,
    },
  },
  emits: ['close', 'confirm'],
  template: '<div data-testid="edit-published-activity-confirmation-modal-stub"></div>',
})
