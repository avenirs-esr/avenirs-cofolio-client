import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ManageSubActivitiesDropdownStub = defineComponent({
  name: 'ManageSubActivitiesDropdown',
  props: {
    ...AvInteractivePropsStub,
    hasSubActivities: {
      type: Boolean,
      default: false,
    },
    hasEnrolledStudent: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['add', 'delete'],
  template: '<div data-testid="manage-sub-activities-dropdown-stub"></div>',
})
