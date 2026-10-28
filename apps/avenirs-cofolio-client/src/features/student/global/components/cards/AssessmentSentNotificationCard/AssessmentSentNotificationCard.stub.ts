import type { PropType } from 'vue'
import type { NotificationDTO } from '@/api/avenir-esr'

export const AssessmentSentNotificationCardStub = defineComponent({
  name: 'AssessmentSentNotificationCard',
  props: {
    notification: {
      type: Object as PropType<NotificationDTO>,
      required: true,
    },
  },
  emits: ['redirect', 'seen'],
  template: `
    <div data-testid="assessment-sent-notification-card">
      <div data-testid="assessment-sent-notification-card-content" />
      <button data-testid="emit-redirect" @click="$emit('redirect')" />
      <button data-testid="emit-seen" @click="$emit('seen', notification.id)" />
    </div>
  `,
})
