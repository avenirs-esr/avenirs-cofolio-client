import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ToggleParameterCardStub = defineComponent({
  name: 'ToggleParameterCard',
  props: {
    ...AvInteractivePropsStub,
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  template: '<div class="toggle-parameter-card"><slot /></div>',
})
