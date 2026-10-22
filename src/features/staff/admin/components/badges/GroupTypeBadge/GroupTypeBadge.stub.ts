import type { PropType } from 'vue'
import type { EGroupType } from '@/api/avenir-esr'

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
