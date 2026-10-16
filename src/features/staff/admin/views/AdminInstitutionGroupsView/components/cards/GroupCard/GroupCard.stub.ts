import type { PropType } from 'vue'
import type { GroupOverviewDTO } from '@/api/avenir-esr'

export const GroupCardStub = defineComponent({
  name: 'GroupCard',
  template: '<div data-testid="group-card-stub"></div>',
  props: {
    group: {
      type: Object as PropType<GroupOverviewDTO>,
      required: true,
    },
  },
})
