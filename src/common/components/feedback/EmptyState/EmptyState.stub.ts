import type { Component } from 'vue'

export const EmptyStateStub: Component = defineComponent({
  name: 'EmptyState',
  template: '<div data-testid="empty-state-stub"></div>',
  props: {
    title: {
      type: String,
    },
    icon: {
      type: String,
    },
  }
})
