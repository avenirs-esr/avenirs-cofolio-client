import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteTraceAssociatedActivitiesModalStub = defineComponent({
  name: 'DeleteTraceAssociatedActivitiesModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    traceId: {
      type: String,
      required: true,
    },
    associations: {
      type: Array as PropType<DeclaredActivityAssociationDTO[]>,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-trace-associated-activities-modal-stub" />',
})
