import type { Component } from 'vue'

export const FeedbackFormFieldStub: Component = {
  name: 'FeedbackFormField',
  props: ['form'],
  template: '<div data-testid="feedback-form-field" />'
}
