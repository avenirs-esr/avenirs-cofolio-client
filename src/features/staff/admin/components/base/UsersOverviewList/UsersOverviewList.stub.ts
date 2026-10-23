import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import type { UsersListRow } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.types'

export const UsersOverviewListStub = defineComponent({
  name: 'UsersOverviewList',
  props: {
    rows: {
      type: Array as PropType<UsersListRow[]>,
      required: true,
    },
    columns: {
      type: Array as PropType<AvTableColumn<UsersListRow>[]>,
      required: true,
    },
  },
  template: '<div data-testid="users-overview-list-stub" />',
})
