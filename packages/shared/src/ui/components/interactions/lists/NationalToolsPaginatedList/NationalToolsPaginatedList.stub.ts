import { defineComponent } from 'vue'

export const NationalToolsPaginatedListStub = defineComponent({
  name: 'NationalToolsPaginatedList',
  props: {
    baseRouteName: {
      type: String,
      required: false
    }
  },
  template: '<div data-testid="national-tools-paginated-list"></div>'
})
