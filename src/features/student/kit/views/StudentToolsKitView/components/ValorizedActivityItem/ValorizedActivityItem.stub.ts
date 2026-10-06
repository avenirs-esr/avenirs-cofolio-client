import type { DeclaredActivityViewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ValorizedActivityItemStub = defineComponent({
  name: 'ValorizedActivityItem',
  template: '<div data-testid="valorized-activity-item-stub" />',
  props: {
    activity: { type: Object as PropType<DeclaredActivityViewDTO>, required: true }
  }
})
