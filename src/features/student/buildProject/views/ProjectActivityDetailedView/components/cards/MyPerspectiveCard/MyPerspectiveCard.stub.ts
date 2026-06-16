import type { EDeclaredActivityStatus } from '@/api/avenir-esr/generated/types/eDeclaredActivityStatus'
import type { PropType } from 'vue'

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
    }
  },
  template: '<div class="my-perspective-card" />'
})
