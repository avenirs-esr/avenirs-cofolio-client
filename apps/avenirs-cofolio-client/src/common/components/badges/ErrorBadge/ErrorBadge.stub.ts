import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export const ErrorBadgeStub = defineComponent({
  name: 'ErrorBadge',
  props: {
    icon: {
      type: String,
      default: MDI_ICONS.CLOSE_OCTAGON,
    },
    label: {
      type: String,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    ellipsis: {
      type: Boolean,
      default: false,
    },
    noSentenceCase: {
      type: Boolean,
      default: false,
    },
  },
  template: '<div data-testid="error-badge-stub" />',
})
