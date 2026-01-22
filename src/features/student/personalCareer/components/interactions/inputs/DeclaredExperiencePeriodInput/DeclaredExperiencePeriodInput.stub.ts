import type { Component } from 'vue'

export const DeclaredExperiencePeriodInputStub: Component = {
  name: 'DeclaredExperiencePeriodInput',
  props: ['labelVisible', 'startModelValue', 'endModelValue', 'startErrorMessage', 'endErrorMessage', 'endDateDisabled'],
  emits: ['update:startModelValue', 'update:endModelValue'],
  template: `
    <div data-testid="declared-experience-period-input-stub">
      <input
        data-testid="start-date-input"
        :value="startModelValue"
        @input="$emit('update:startModelValue', $event.target.value)"
      />
      <input
        data-testid="end-date-input"
        :value="endModelValue"
        :disabled="endDateDisabled"
        @input="$emit('update:endModelValue', $event.target.value)"
      />
    </div>
  `
}
