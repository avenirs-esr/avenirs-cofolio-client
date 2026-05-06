export const DeclaredExperienceOrganizationInputStub = defineComponent({
  name: 'DeclaredExperienceOrganizationInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur', 'maxlengthExceeded'],
  template: `
    <div data-testid="declared-experience-organization-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
