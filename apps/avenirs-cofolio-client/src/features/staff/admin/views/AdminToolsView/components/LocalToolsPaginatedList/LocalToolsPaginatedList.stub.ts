import type { EToolType } from '@avenirs-esr/shared/api/avenir-esr'

export const LocalToolsPaginatedListStub = defineComponent({
  name: 'LocalToolsPaginatedList',
  props: {
    type: {
      type: String as () => EToolType,
      required: true
    }
  },
  template: '<div data-testid="local-tools-paginated-list"></div>'
})
