import type { EToolType } from '#shared/api/avenir-esr/index'
import { defineComponent } from 'vue'

export const AdminToolsPaginatedListStub = defineComponent({
  name: 'AdminToolsPaginatedList',
  props: {
    baseRouteName: {
      type: String,
      required: false,
    },
    type: {
      type: String as () => EToolType | undefined,
      required: true,
    },
  },
  template: '<div data-testid="admin-tools-paginated-list"></div>',
})
