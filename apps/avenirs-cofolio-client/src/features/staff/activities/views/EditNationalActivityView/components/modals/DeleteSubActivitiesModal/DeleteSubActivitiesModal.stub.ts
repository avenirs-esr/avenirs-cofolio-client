import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteSubActivitiesModalStub = defineComponent({
  name: 'DeleteSubActivitiesModal',
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    activityDraftId: {
      type: String,
      required: true,
    },
    subActivities: {
      type: Array as PropType<SubActivityOverviewDTO[]>,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-sub-activities-modal-stub" />',
})
