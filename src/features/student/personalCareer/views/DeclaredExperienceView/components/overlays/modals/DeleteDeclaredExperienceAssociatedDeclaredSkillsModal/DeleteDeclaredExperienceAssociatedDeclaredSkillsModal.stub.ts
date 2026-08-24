import type { DeclaredSkillAssociationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteDeclaredExperienceAssociatedDeclaredSkillsModalStub = defineComponent({
  name: 'DeleteDeclaredExperienceAssociatedDeclaredSkillsModal',
  props: {
    show: { type: Boolean, required: true },
    experienceId: { type: String, required: true },
    associations: { type: Array as PropType<DeclaredSkillAssociationDTO[]>, required: true },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-declared-experience-associated-declared-skills-modal-stub" />',
})
