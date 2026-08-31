import type { ValorizedElementType } from '@/features/kit/types/valorized.types'
import type { PropType } from 'vue'

export const ValorizedItemStub = defineComponent({
  name: 'ValorizedItem',
  template: '<div data-testid="valorized-item-stub"><slot /></div>',
  props: {
    title: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
    },
    type: {
      type: String as PropType<ValorizedElementType>,
      required: true,
    },
  },
})
