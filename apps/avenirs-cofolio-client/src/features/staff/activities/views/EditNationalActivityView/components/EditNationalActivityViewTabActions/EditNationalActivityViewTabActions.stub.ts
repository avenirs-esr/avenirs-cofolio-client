import type { ActivityPresentationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const EditNationalActivityViewTabActionsStub = defineComponent({
  name: 'EditNationalActivityViewTabActions',
  props: {
    activity: {
      type: Object as PropType<ActivityPresentationDTO>,
    },
    nextStepConfig: Boolean,
    hasPublishRight: Boolean,
  },
  emits: ['nextStep', 'published'],
  template: '<div data-testid="edit-national-activity-view-tab-actions-stub"></div>',
})
