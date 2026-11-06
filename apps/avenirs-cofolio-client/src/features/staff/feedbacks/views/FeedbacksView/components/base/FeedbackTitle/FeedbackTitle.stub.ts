import type { PropType } from 'vue'

export const FeedbackTitleStub = defineComponent({
  name: 'FeedbackTitleStub',
  props: {
    feedback: {
      type: Object as PropType<{ id: string, title: string }>,
      required: true,
    },
    withNav: {
      type: Boolean,
      default: false,
    }
  },
  template: '<div data-testid="feedback-title">{{ feedback.title }}</div>',
})
