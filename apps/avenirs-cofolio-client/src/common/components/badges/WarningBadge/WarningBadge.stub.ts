import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export const WarningBadgeStub = defineComponent({
  name: 'WarningBadge',
  props: {
    icon: {
      type: String,
      default: MDI_ICONS.WARNING_OUTLINE,
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
  template: '<div data-testid="warning-badge-stub" />',
})
