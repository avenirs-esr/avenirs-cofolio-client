import type { EGroupType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const GroupTypeBadgeStub = defineComponent({
  name: 'GroupTypeBadge',
  props: {
    type: {
      type: String as PropType<EGroupType>,
      required: true
    }
  },
  template: `<div data-testid="group-type-badge" />`
})
