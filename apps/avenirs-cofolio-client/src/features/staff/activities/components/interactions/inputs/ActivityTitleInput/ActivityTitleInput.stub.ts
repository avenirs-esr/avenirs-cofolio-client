import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ActivityTitleInputStub = defineComponent({
  name: 'ActivityTitleInput',
  props: {
    ...AvInteractivePropsStub,
    modelValue: {
      type: String,
      default: undefined,
    },
    errorMessage: {
      type: String,
      default: undefined,
    },
    labelVisible: {
      type: Boolean,
      default: false
    },
    isSubActivity: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'blur'],
  template: '<div data-testid="activity-title-input-stub"></div>',
})
