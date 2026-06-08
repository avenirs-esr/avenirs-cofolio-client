export const InputStub = defineComponent({
  name: 'Input',
  props: [
    'modelValue',
    'label',
    'placeholder',
    'maxlength',
    'min',
    'max',
    'hint',
    'prefixIcon',
    'textareaMinHeight',
    'isValid',
    'isTextarea',
    'labelVisible',
    'disabled',
    'required',
    'errorMessage'
  ],
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
    </div>
  `
})
