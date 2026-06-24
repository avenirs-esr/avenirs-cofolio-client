import type { NotificationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const NotificationsPopoverListStub = defineComponent({
  name: 'NotificationsPopoverList',
  props: {
    notifications: {
      type: Array as PropType<NotificationDTO[]>,
      required: true
    },
    isFetching: {
      type: Boolean,
      required: true
    }
  },
  emits: ['loadMore'],
  template: `
    <div data-testid="notifications-popover-list">
      <slot
        v-for="n in notifications"
        :key="n.id"
        :notification="n"
      />

      <div
        v-if="isFetching"
        data-testid="notifications-popover-list-fetching"
      />

      <button
        data-testid="notifications-popover-list-load-more"
        @click="$emit('loadMore')"
      />
    </div>
  `
})
