import type { Component } from 'vue'

export const DeclaredExperienceOrganizationInputStub: Component = {
  name: 'DeclaredExperienceOrganizationInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-organization-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
}
