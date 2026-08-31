import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteDeclaredExperienceAssociatedTracesModalStub = defineComponent({
  name: 'DeleteDeclaredExperienceAssociatedTracesModal',
  props: {
    show: { type: Boolean, required: true },
    experienceId: { type: String, required: true },
    associations: { type: Array as PropType<TraceAssociationDTO[]>, required: true },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-declared-experience-associated-traces-modal-stub" />',
})
