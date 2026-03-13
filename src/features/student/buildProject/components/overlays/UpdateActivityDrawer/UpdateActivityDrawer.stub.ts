import type { Component } from 'vue'

export const UpdateActivityDrawerStub: Component = defineComponent({
  name: 'UpdateActivityDrawer',
  template: '<div data-testid="update-activity-drawer-stub"></div>',
  props: {
    show: {
      type: Boolean,
    },
    declaredActivity: {
      type: Object,
    },
  },
})
