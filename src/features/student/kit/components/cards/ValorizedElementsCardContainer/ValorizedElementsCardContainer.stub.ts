export const ValorizedElementsCardContainerStub = defineComponent({
  name: 'ValorizedElementsCardContainer',
  props: {
    title: { type: String, required: true },
    error: { type: Object, default: null },
    isLoading: { type: Boolean, default: false },
    isEmpty: { type: Boolean, default: false },
    emptyStateMessage: { type: String, default: undefined },
    seeAllLabel: { type: String, default: undefined },
    seeAllTo: { type: [String, Object], default: undefined }
  },
  template: `
    <div data-testid="valorized-elements-card-container-stub">
      <div data-testid="valorized-elements-card-container-title">{{ title }}</div>
      <slot v-if="!isEmpty" />
      <div v-else data-testid="valorized-elements-card-container-empty">{{ emptyStateMessage }}</div>
      <div v-if="seeAllLabel" data-testid="valorized-elements-card-container-see-all">{{ seeAllLabel }}</div>
    </div>
  `,
})
