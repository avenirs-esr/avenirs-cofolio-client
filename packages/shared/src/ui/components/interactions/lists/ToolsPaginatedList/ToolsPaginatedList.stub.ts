import type { EToolType } from '#shared/api/avenir-esr/index'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const ToolsPaginatedListStub = defineComponent({
  name: 'ToolsPaginatedList',
  props: {
    baseRouteName: {
      type: String,
      required: false,
    },
    type: {
      type: String as PropType<EToolType>,
      required: true,
    },
  },
  emits: {
    count: (_type: EToolType, _value: number) => true,
  },
  template: '<div data-testid="tools-paginated-list"></div>',
})
