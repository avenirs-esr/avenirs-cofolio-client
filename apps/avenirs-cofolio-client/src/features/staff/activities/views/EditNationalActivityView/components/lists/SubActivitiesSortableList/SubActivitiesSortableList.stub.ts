import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const SubActivitiesSortableListStub = defineComponent({
  name: 'SubActivitiesSortableList',
  props: {
    modelValue: {
      type: Array as PropType<SubActivityOverviewDTO[]>,
      required: true,
    },
    activityStartDate: {
      type: String,
      default: undefined,
    },
    activityEndDate: {
      type: String,
      default: undefined,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="sub-activities-sortable-list-stub" />',
})
