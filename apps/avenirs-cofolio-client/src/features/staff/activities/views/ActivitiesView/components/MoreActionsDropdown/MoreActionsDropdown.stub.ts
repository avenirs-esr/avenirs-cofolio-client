import type { AvDropdownProps } from '@avenirs-esr/avenirs-dsav'
import type { EActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const MoreActionsDropdownStub = defineComponent({
  name: 'MoreActionsDropdown',
  template: '<div data-testid="more-actions-dropdown-stub"></div>',
  props: {
    activityStatus: {
      type: String as PropType<EActivityStatus>,
      required: true,
    },
    isLeader: Boolean,
    triggerSize: String as PropType<AvDropdownProps['triggerSize']>
  },
  emits: ['delete', 'unpublish', 'navigateToFeedbacks', 'clone'],
})
