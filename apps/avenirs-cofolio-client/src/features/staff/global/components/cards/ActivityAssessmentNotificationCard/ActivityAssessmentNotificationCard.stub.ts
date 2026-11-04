import type { PropType } from 'vue'
import type { NotificationDTO } from '@/api/avenir-esr'

export const ActivityAssessmentNotificationCardStub = defineComponent({
  name: 'ActivityAssessmentNotificationCard',
  props: {
    notification: {
      type: Object as PropType<NotificationDTO>,
      required: true,
    },
  },
  emits: ['redirect', 'seen'],
  template: `
    <div data-testid="activity-assessment-notification-card">
      <div data-testid="activity-assessment-notification-card-content" />
      <button data-testid="emit-redirect" @click="$emit('redirect')" />
      <button data-testid="emit-seen" @click="$emit('seen', notification.id)" />
    </div>
  `,
})
