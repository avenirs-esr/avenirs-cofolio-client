export const ValorizedElementsCardContainerStub = defineComponent({
  name: 'ValorizedElementsCardContainer',
  props: {
    title: { type: String, required: true },
    error: { type: Object, default: null },
    isLoading: { type: Boolean, default: false },
  },
  template: `
    <div data-testid="valorized-elements-card-container-stub">
      <div data-testid="valorized-elements-card-container-title">{{ title }}</div>
      <slot />
    </div>
  `,
})
