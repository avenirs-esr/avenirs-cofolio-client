import type { PropType } from 'vue'
import type { GroupDTO } from '@/api/avenir-esr'

export const DetailedGroupCardStub = defineComponent({
  name: 'DetailedGroupCard',
  props: {
    group: {
      type: Object as PropType<GroupDTO>,
      required: true,
    },
  },
  template: '<div data-testid="detailed-group-card-stub" />',
})
