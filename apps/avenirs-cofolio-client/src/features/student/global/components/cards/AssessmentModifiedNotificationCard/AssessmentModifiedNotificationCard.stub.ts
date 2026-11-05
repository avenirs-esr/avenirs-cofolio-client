import type { PropType } from 'vue'
import type { NotificationDTO } from '@/api/avenir-esr'

export const AssessmentModifiedNotificationCardStub = defineComponent({
  name: 'AssessmentModifiedNotificationCard',
  props: {
    notification: {
      type: Object as PropType<NotificationDTO>,
      required: true,
    },
  },
  emits: ['redirect', 'seen'],
  template: `
    <div data-testid="assessment-modified-notification-card">
      <div data-testid="assessment-modified-notification-card-content" />
      <button data-testid="emit-redirect" @click="$emit('redirect')" />
      <button data-testid="emit-seen" @click="$emit('seen', notification.id)" />
    </div>
  `,
})
