import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteDeclaredSkillAssociatedTracesModalStub = defineComponent({
  name: 'DeleteDeclaredSkillAssociatedTracesModal',
  props: {
    show: { type: Boolean, required: true },
    declaredSkillProgressId: { type: String, required: true },
    associations: { type: Array as PropType<TraceAssociationDTO[]>, required: true },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-declared-skill-associated-traces-modal-stub" />',
})
