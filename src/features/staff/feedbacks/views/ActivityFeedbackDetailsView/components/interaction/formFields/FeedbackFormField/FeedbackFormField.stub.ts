import type { Component } from 'vue'

export const FeedbackFormFieldStub: Component = {
  name: 'FeedbackFormField',
  props: ['form', 'readonly'],
  template: '<div data-testid="feedback-form-field" />'
}
