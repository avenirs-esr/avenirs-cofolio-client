import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
