import type { EditActivityTabIndex } from '@/features/staff/activities/editActivity.constants'
import type { PropType } from 'vue'

export const AddNationalActivitySideNavigationStub = defineComponent({
  name: 'AddNationalActivitySideNavigation',
  props: {
    activeTab: { type: Number as PropType<EditActivityTabIndex> },
  },
  template: '<div data-testid="add-national-activity-side-navigation-stub"></div>',
})
