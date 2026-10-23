import type { PropType } from 'vue'
import type { EAssociationContextType } from '@/api/avenir-esr'

export const CountAssociationsBadgeStub = defineComponent({
  name: 'CountAssociationsBadge',
  template: '<div data-testid="count-associations-badge-stub" />',
  props: {
    type: { type: String as PropType<EAssociationContextType>, required: true },
    count: { type: Number, required: true }
  }
})
