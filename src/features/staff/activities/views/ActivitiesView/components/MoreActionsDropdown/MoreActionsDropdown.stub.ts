import type { PropType } from 'vue'
import type { EActivityStatus } from '@/api/avenir-esr'

export const MoreActionsDropdownStub = defineComponent({
  name: 'MoreActionsDropdown',
  template: '<div data-testid="more-actions-dropdown-stub"></div>',
  props: {
    activityStatus: {
      type: String as PropType<EActivityStatus>,
      required: true,
    },
    isLeader: Boolean,
  },
  emits: ['delete', 'unpublish', 'navigateToFeedbacks', 'clone'],
})
