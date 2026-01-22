import type { Component } from 'vue'

export const DeclaredExperienceDescriptionTextareaStub: Component = {
  name: 'DeclaredExperienceDescriptionTextarea',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-description-textarea-stub">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
}
