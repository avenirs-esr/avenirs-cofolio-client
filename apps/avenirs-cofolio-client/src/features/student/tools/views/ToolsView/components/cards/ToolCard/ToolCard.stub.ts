export const ToolCardStub = defineComponent({
  name: 'ToolCard',
  props: {
    name: { type: String, required: true },
    bannerUrl: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
  },
  template: `
    <div data-testid="tool-card-stub">
      <div data-testid="tool-card-stub-title">{{ name }}</div>
      <div data-testid="tool-card-stub-banner">{{ bannerUrl }}</div>
      <div data-testid="tool-card-stub-description">{{ description }}</div>
      <div data-testid="tool-card-stub-url">{{ url }}</div>
    </div>
  `,
})
