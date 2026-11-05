import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const AlertActiveToggleStub = defineComponent({
  name: 'AlertActiveToggle',
  props: {
    ...AvInteractivePropsStub,
    id: {
      type: String,
      default: undefined,
    },
    name: {
      type: String,
      default: undefined,
    },
    modelValue: {
      type: Boolean,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="alert-active-toggle-stub" />',
})
