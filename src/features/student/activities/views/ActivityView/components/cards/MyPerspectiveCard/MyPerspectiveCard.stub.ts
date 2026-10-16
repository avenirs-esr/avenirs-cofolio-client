import type { PropType } from 'vue'
import type { EFeedbackStatus } from '@/api/avenir-esr'
import type { EDeclaredActivityStatus } from '@/api/avenir-esr/generated/types/eDeclaredActivityStatus'

export const MyPerspectiveCardStub = defineComponent({
  name: 'MyPerspectiveCard',
  props: {
    activityId: {
      type: String,
      required: true
    },
    perspective: {
      type: String,
      required: false
    },
    activityStatus: {
      type: String as PropType<EDeclaredActivityStatus>,
      required: false
    },
    lastFeedbackStatus: {
      type: String as PropType<EFeedbackStatus>,
      required: false
    }
  },
  template: '<div class="my-perspective-card" />'
})
