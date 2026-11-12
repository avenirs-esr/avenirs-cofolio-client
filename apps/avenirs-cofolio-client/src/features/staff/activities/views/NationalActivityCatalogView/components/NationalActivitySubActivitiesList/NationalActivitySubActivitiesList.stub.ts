import type { EActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'
import type { SubActivityOverviewDTO } from '@/api/avenir-esr'

export const NationalActivitySubActivitiesListStub = defineComponent({
  name: 'NationalActivitySubActivitiesList',
  props: {
    subActivities: {
      type: Array as PropType<SubActivityOverviewDTO[]>,
      required: true,
    },
    status: {
      type: String as PropType<EActivityStatus>,
      required: true,
    },
  },
  template: '<div data-testid="national-activity-sub-activities-list-stub" />',
})
