import type {
  AssociationDeclaredSkill
} from '@/features/declaredSkills/components/overlays/modals/AssociateDeclaredSkillsModal/AssociateDeclaredSkillsModal.vue'
import type { PropType } from 'vue'

export const AssociateDeclaredSkillsModalStub = defineComponent({
  name: 'AssociateDeclaredSkillsModal',
  props: {
    show: { type: Boolean, required: true },
    skills: { type: Array as PropType<AssociationDeclaredSkill[]>, required: true as const },
    isLoading: { type: Boolean, default: false },
  },
  emits: ['cancel', 'search', 'associate'],
  template: `
    <div v-if="show" data-testid="associate-declared-skills-modal-stub">
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associate', [])">Associate</button>
    </div>
  `
})
