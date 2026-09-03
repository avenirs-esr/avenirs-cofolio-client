import type { AssociationDeclaredExperiences } from '@/features/student/personalCareer/components/modals/AssociateDeclaredExperiencesModal/AssociateDeclaredExperiencesModal.vue'
import type { PropType } from 'vue'

export const AssociateDeclaredExperiencesModalStub = defineComponent({
  name: 'AssociateDeclaredExperiencesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    experiences: {
      type: Array as PropType<AssociationDeclaredExperiences[]>,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'search', 'associate'],
  template: `
    <div data-testid="associate-declared-experiences-modal-stub">
      <slot />
    </div>
  `
})
