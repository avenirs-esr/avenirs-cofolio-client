import type { EUserCategory } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const NotificationsPopoverPreferenceToggleStub = defineComponent({
  name: 'NotificationsPopoverPreferenceToggle',
  props: {
    userCategory: {
      type: String as PropType<EUserCategory>,
      required: true,
    }
  },
  template: `<div data-testid="notifications-popover-preference-toggle" />`
})
