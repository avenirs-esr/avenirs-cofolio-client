import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityLayoutStub = defineComponent({
  name: 'ActivityLayout',
  props: {
    declaredActivityDetails: {
      type: Object as PropType<DeclaredActivityDetailsDTO>,
      required: true
    }
  },
  template: `
    <div data-testid="activity-layout" />
  `,
})
