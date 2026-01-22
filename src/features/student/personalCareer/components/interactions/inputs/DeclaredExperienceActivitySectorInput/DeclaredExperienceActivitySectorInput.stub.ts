import type { Component } from 'vue'

export const DeclaredExperienceActivitySectorInputStub: Component = {
  name: 'DeclaredExperienceActivitySectorInput',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-activity-sector-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
}
