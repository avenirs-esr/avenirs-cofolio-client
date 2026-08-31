import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteDeclaredSkillAssociatedActivitiesModalStub = defineComponent({
  name: 'DeleteDeclaredSkillAssociatedActivitiesModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    declaredSkillProgressId: {
      type: String,
      required: true,
    },
    associations: {
      type: Array as PropType<DeclaredActivityAssociationDTO[]>,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-declared-skill-associated-activities-modal-stub" />',
})
