import type { EUserCategory } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const NotificationsPopoverStub = defineComponent({
  name: 'NotificationsPopover',
  inheritAttrs: false,
  props: {
    userCategory: {
      type: String as PropType<EUserCategory>,
      required: true,
    }
  },
  template: `
    <div data-testid="notifications-popover">
      <template v-if="$attrs.notifications?.length > 0">
        <slot
          v-for="n in $attrs.notifications"
          :key="n.id"
          name="default"
          :notification="n"
          :on-redirect="() => {}"
          :on-seen="() => {}"
        />
      </template>

      <slot
        v-else-if="$slots.empty"
        name="empty"
      />
    </div>
  `
})
