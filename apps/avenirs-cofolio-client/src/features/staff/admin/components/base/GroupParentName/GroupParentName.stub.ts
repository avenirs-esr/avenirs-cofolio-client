import type { GroupOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const GroupParentNameStub = defineComponent({
  name: 'GroupParentName',
  props: {
    group: {
      type: Object as PropType<GroupOverviewDTO>,
      required: true,
    },
    withNav: {
      type: Boolean,
      required: false,
    }
  },
  template: '<div data-testid="group-parent-name-stub">{{ group.parentName }}</div>',
})
