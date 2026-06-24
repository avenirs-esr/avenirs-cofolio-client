import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const NotificationCardStub = defineComponent({
  name: 'NotificationCard',
  props: {
    id: {
      type: String,
      required: true
    },
    seen: {
      type: Boolean,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    to: [String, Object] as PropType<RouteLocationRaw>
  },
  emits: ['redirect', 'seen'],
  template: `<div data-testid="notification-card"><slot /></div>`
})
