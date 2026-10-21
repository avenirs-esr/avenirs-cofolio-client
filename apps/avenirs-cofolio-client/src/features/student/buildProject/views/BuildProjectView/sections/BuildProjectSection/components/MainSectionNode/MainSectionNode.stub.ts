import type { NodeProps } from '@vue-flow/core'
import type { PropType } from 'vue'

export const MainSectionNodeStub = defineComponent({
  name: 'MainSectionNode',
  props: {
    data: { type: Object as PropType<NodeProps['data']>, required: true },
  },
  template: '<div>{{ data.label }}</div>',
})
