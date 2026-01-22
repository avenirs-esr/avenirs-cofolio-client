import type { Component } from 'vue'

export const DeclaredExperienceLinkInputStub: Component = {
  name: 'DeclaredExperienceLinkInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-link-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
}
