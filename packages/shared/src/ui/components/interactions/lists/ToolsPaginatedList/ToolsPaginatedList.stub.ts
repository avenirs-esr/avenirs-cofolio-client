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
      type: String as PropType<EToolType | undefined>,
      required: true,
    },
  },
  template: '<div data-testid="tools-paginated-list"></div>',
})
