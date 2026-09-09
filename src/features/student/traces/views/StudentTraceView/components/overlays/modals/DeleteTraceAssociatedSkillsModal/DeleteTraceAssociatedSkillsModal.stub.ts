import type { DeclaredSkillAssociationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteTraceAssociatedSkillsModalStub = defineComponent({
  name: 'DeleteTraceAssociatedSkillsModal',
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    traceId: {
      type: String,
      required: true,
    },
    associations: {
      type: Array as PropType<DeclaredSkillAssociationDTO[]>,
      required: true,
    }
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-trace-associated-skills-modal-stub" />',
})
