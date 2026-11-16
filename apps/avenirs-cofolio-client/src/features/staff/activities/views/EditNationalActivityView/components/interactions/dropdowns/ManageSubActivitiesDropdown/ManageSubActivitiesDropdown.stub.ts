import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ManageSubActivitiesDropdownStub = defineComponent({
  name: 'ManageSubActivitiesDropdown',
  props: {
    ...AvInteractivePropsStub,
  },
  emits: ['add'],
  template: '<div data-testid="manage-sub-activities-dropdown-stub"></div>',
})
