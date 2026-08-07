export const ValorizedSelfKnowledgeItemStub = defineComponent({
  name: 'ValorizedSelfKnowledgeItem',
  props: {
    element: { type: Object, required: true },
    showCategoryBadge: { type: Boolean, default: false }
  },
  template: '<div data-testid="valorized-self-knowledge-item-stub" />'
})
