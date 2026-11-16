import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const SubActivitiesSortableListStub = defineComponent({
  name: 'SubActivitiesSortableList',
  props: {
    modelValue: {
      type: Array as PropType<SubActivityOverviewDTO[]>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="sub-activities-sortable-list-stub" />',
})
