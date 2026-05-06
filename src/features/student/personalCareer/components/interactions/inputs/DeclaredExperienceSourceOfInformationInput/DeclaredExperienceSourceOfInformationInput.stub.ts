export const DeclaredExperienceSourceOfInformationInputStub = defineComponent({
  name: 'DeclaredExperienceSourceOfInformationInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur', 'maxlengthExceeded'],
  template: `
    <div data-testid="declared-experience-source-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
