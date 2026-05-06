export const DeclaredExperienceExternalLinkInputStub = defineComponent({
  name: 'DeclaredExperienceExternalLinkInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur', 'maxlengthExceeded'],
  template: `
    <div data-testid="declared-experience-link-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
