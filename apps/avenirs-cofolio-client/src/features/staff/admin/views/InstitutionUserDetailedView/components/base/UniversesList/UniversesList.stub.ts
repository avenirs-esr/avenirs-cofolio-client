import type { EUniverse } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
