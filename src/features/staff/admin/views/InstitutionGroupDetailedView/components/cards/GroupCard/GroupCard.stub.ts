import type { PropType } from 'vue'
import type { GroupDTO } from '@/api/avenir-esr'

export const GroupCardStub = defineComponent({
  name: 'GroupCard',
  props: {
    group: {
      type: Object as PropType<GroupDTO>,
      required: true,
    },
  },
  template: '<div data-testid="group-card-stub" />',
})
