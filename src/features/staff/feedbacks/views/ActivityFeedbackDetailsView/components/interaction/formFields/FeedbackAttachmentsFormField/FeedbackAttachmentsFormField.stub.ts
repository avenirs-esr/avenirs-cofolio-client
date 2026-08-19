import type { Component } from 'vue'

export const FeedbackAttachmentsFormFieldStub: Component = {
  name: 'FeedbackAttachmentsFormField',
  props: ['form', 'readonly'],
  template: '<div data-testid="feedback-attachments-form-field" />'
}
