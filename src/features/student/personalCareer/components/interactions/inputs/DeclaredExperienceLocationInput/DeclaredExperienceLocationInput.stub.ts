import type { Component } from 'vue'

export const DeclaredExperienceLocationInputStub: Component = {
  name: 'DeclaredExperienceLocationInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-location-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
}
