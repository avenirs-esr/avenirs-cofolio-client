import type { NotificationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityModifiedNotificationCardStub = defineComponent({
  name: 'ActivityModifiedNotificationCard',
  props: {
    notification: {
      type: Object as PropType<NotificationDTO>,
      required: true,
    },
  },
  emits: ['redirect', 'seen'],
  template: `
    <div data-testid="activity-modified-notification-card">
      <div data-testid="activity-modified-notification-card-content" />
      <button data-testid="emit-redirect" @click="$emit('redirect')" />
      <button data-testid="emit-seen" @click="$emit('seen', notification.id)" />
    </div>
  `,
})
