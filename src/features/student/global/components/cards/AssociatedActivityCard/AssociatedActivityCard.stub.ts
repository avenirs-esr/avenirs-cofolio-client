import type { DeclaredActivityViewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const AssociatedActivityCardStub = defineComponent({
  name: 'AssociatedActivityCard',
  props: {
    declaredActivity: {
      type: Object as PropType<DeclaredActivityViewDTO>,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  template: '<div data-testid="associated-declared-activity-card"></div>'
})
