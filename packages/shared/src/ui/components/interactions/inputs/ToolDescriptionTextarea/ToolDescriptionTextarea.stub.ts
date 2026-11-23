import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'
import { defineComponent } from 'vue'

export const ToolDescriptionTextareaStub = defineComponent({
  name: 'ToolDescriptionTextarea',
  props: {
    ...AvInteractivePropsStub,
    modelValue: {
      type: String as PropType<string | null>,
      default: null,
    },
    required: Boolean,
    errorMessage: String,
  },
  emits: ['update:modelValue', 'blur'],
  template: '<div data-testid="tool-description-textarea-stub" />',
})
