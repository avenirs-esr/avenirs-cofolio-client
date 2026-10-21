import type { PropType } from 'vue'
import type { EUniverse } from '@/api/avenir-esr'

export const UniversesListStub = defineComponent({
  name: 'UniversesList',
  props: {
    universes: {
      type: Array as PropType<EUniverse[]>,
      required: true,
    },
  },
  template: '<div class="universes-list-stub"></div>',
})
