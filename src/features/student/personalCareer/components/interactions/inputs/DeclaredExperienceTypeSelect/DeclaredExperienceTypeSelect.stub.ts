export const DeclaredExperienceTypeSelectStub = defineComponent({
  name: 'DeclaredExperienceTypeSelect',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-type-select-stub">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      >
        <option value="">Select</option>
        <option value="PROFESSIONAL">Professional</option>
        <option value="ASSOCIATIVE">Associative</option>
      </select>
    </div>
  `
})
