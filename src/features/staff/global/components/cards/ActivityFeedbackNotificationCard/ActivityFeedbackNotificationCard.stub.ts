export const ActivityFeedbackNotificationCardStub = defineComponent({
  name: 'ActivityFeedbackNotificationCard',
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  emits: ['redirect', 'seen'],
  template: `
    <div data-testid="activity-feedback-notification-card">
      <div data-testid="activity-feedback-notification-card-content" />
      <button data-testid="emit-redirect" @click="$emit('redirect')" />
      <button data-testid="emit-seen" @click="$emit('seen', notification.id)" />
    </div>
  `,
})
