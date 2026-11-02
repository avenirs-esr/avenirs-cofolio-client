import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const InputStub = defineComponent({
  name: 'Input',
  props: {
    ...AvInteractivePropsStub,
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
      default: null,
    },
    label: String,
    placeholder: String,
    maxlength: Number,
    min: [String, Number],
    max: [String, Number],
    hint: String,
    prefixIcon: String,
    textareaMinHeight: [String, Number],
    isValid: Boolean,
    isTextarea: Boolean,
    labelVisible: Boolean,
    required: Boolean,
    errorMessage: String,
  },
  emits: ['update:modelValue'],
  template: `
    <div>
      <label v-if="labelVisible">{{ label }}</label>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span data-testid="maxlength-caption">{{ modelValue?.length || 0 }} / {{ maxlength }} caractères (espaces compris)</span>
      <slot name="suffix" />
    </div>
  `,
})
