import type { AssociationBadgeType } from '@/common/types'
import type { PropType } from 'vue'

export const AssociationBadgeStub = defineComponent({
  name: 'AssociationBadge',
  props: {
    count: {
      type: Number,
      required: true,
    },
    type: {
      type: String as PropType<AssociationBadgeType>,
      required: true,
    },
  },
  template: '<div class="association-badge-stub" />',
})
