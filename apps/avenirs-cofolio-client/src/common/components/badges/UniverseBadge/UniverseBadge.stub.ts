import type { PropType } from 'vue'
import type { EUniverse } from '@/api/avenir-esr'

export const UniverseBadgeStub = defineComponent({
  name: 'UniverseBadge',
  props: {
    universe: {
      type: String as PropType<EUniverse>,
      required: true,
    },
  },
  template: '<div class="universe-badge-stub">{{ universe }}</div>',
})
