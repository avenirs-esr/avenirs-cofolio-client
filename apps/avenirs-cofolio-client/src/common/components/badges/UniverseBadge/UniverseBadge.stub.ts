import type { EUniverse } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
