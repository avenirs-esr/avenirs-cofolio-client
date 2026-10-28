import { defineComponent } from 'vue'

export const ErrorMessageStub = defineComponent({
  name: 'ErrorMessage',
  props: {
    title: { type: String },
    description: { type: String },
  },
  template: `
    <div data-testid="error-message">
      <h3 data-testid="error-message-title">{{ title }}</h3>
      <p data-testid="error-message-description">{{ description }}</p>
    </div>
  `,
})
