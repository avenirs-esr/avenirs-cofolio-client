import type { DeclaredSkillAssociationDTO } from '@/api/avenir-esr'

export const DeleteTraceAssociatedSkillsModalStub = defineComponent({
  name: 'DeleteTraceAssociatedSkillsModal',
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
      type: Object as () => DeclaredSkillAssociationDTO[],
      required: true,
    }
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-trace-associated-skills-modal-stub" />',
})
