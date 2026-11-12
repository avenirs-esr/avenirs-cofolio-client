import type { PropType } from 'vue'
import type { SubActivityOverviewDTO } from '@/api/avenir-esr'

export const SubActivitiesSortableListStub = defineComponent({
  name: 'SubActivitiesSortableList',
  props: {
    subActivities: {
      type: Array as PropType<SubActivityOverviewDTO[]>,
      required: true,
    },
  },
  template: '<div data-testid="sub-activities-sortable-list-stub" />',
})
