import type { GroupDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
