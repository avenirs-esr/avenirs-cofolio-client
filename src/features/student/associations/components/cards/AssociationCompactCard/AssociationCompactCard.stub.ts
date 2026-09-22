import type { EAssociationContextType } from '@/api/avenir-esr'
import type { Association } from '@/features/student/associations/types/associations.types'
import type { PropType } from 'vue'

export const AssociationCompactCardStub = defineComponent({
  name: 'AssociationCompactCard',
  props: {
    contextType: { type: String as PropType<EAssociationContextType>, required: true },
    association: { type: Object as PropType<Association>, required: true }
  },
  template: '<div data-testid="association-compact-card-stub">{{ association.title }}</div>'
})
