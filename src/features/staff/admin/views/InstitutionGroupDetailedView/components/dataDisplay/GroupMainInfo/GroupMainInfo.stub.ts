import type { PropType } from 'vue'
import type { GroupDTO } from '@/api/avenir-esr'

export const GroupMainInfoStub = defineComponent({
  name: 'GroupMainInfo',
  props: {
    group: {
      type: Object as PropType<GroupDTO>,
      required: true,
    },
  },
  template: '<div data-testid="group-main-info-stub" />',
})
