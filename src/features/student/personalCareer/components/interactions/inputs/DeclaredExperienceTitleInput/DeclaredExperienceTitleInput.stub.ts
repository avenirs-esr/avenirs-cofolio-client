export const DeclaredExperienceTitleInputStub = defineComponent({
  name: 'DeclaredExperienceTitleInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-title-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
