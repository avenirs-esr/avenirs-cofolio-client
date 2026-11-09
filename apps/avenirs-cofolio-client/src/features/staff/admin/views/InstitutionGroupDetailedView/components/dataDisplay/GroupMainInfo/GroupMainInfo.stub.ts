import type { GroupDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
