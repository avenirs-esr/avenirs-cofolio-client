import type { EAssociationContextType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const CountAssociationsBadgeStub = defineComponent({
  name: 'CountAssociationsBadge',
  template: '<div data-testid="count-associations-badge-stub" />',
  props: {
    type: { type: String as PropType<EAssociationContextType>, required: true },
    count: { type: Number, required: true }
  }
})
