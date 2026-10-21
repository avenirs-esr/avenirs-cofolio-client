import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import type { GroupsListRow } from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.types'

export const GroupOverviewListStub = defineComponent({
  name: 'GroupOverviewList',
  props: {
    rows: {
      type: Array as PropType<GroupsListRow[]>,
      required: true,
    },
    columns: {
      type: Array as PropType<AvTableColumn<GroupsListRow>[]>,
      required: true,
    },
    subGroupMode: {
      type: Boolean,
      required: true,
    },
  },
  template: '<div data-testid="group-overview-list-stub" />',
})
