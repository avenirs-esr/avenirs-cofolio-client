export const FeedbackTextareaStub = defineComponent({
  name: 'FeedbackTextarea',
  props: ['modelValue', 'label', 'errorMessage', 'required', 'labelVisible', 'disabled'],
  emits: ['blur', 'update:modelValue'],
  template: `
    <div data-testid="feedback-textarea-stub">
      <textarea
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
      <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
    </div>
  `,
})
