export const DeclaredExperienceSummaryTextareaStub = defineComponent({
  name: 'DeclaredExperienceSummaryTextarea',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-summary-textarea-stub">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
