import type { EUserCategory } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const NotificationsPopoverEmptyOrDisabledStub = defineComponent({
  name: 'NotificationsPopoverEmptyOrDisabled',
  props: {
    userCategory: {
      type: String as PropType<EUserCategory>,
      required: true,
    }
  },
  template: `
    <div data-testid="notifications-popover-empty">
      <slot v-if="$slots.default" />

      <span
        v-else
        data-testid="notifications-popover-disabled-message"
      >
        empty
      </span>
    </div>
  `
})
