export const DeclaredExperienceLocationInputStub = defineComponent({
  name: 'DeclaredExperienceLocationInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur', 'maxlengthExceeded'],
  template: `
    <div data-testid="declared-experience-location-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
