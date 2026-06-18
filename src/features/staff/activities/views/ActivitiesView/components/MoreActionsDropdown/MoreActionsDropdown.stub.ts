import type { EActivityStatus } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const MoreActionsDropdownStub = defineComponent({
  name: 'MoreActionsDropdown',
  template: '<div data-testid="more-actions-dropdown-stub"></div>',
  props: {
    activityStatus: {
      type: String as PropType<EActivityStatus>,
      required: true,
    },
  },
  emits: ['deleteSelected'],
})
