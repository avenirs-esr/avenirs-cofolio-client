export const DeclaredExperienceReviewTextareaStub = defineComponent({
  name: 'DeclaredExperienceReviewTextarea',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-review-textarea-stub">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
