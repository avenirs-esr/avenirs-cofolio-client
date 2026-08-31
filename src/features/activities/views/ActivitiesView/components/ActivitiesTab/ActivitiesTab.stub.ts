import type { UsePaginatedStaffActivitiesParams } from '@/features/activities/composables/use-paginated-staff-activites/use-paginated-staff-activites'
import type { PropType } from 'vue'

export const ActivitiesTabStub = defineComponent({
  name: 'ActivitiesTab',
  template: '<div data-testid="activities-tab-stub"><slot name="actions" /></div>',
  props: {
    title: {
      type: String,
      required: true,
    },
    emptyStateMessage: String,
    withStatus: Boolean,
    withActions: Boolean,
    usePaginatedStaffActivitiesParams: {
      type: Object as PropType<UsePaginatedStaffActivitiesParams>,
      required: true,
    },
  },
  emits: ['updateActivitiesCount', 'unpublished', 'deleted'],
})
