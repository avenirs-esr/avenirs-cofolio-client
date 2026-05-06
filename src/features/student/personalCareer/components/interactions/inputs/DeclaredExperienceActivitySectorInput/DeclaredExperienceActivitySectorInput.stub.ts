export const DeclaredExperienceActivitySectorInputStub = defineComponent({
  name: 'DeclaredExperienceActivitySectorInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur', 'maxlengthExceeded'],
  template: `
    <div data-testid="declared-experience-activity-sector-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
