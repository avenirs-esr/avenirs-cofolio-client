export const ValorizedSelfKnowledgeContainerStub = defineComponent({
  name: 'ValorizedSelfKnowledgeContainer',
  props: {
    interestsOnly: { type: Boolean, default: false }
  },
  template: '<div :data-testid="interestsOnly ? \'valorized-self-knowledge-interests-container-stub\' : \'valorized-self-knowledge-others-container-stub\'" />',
})
