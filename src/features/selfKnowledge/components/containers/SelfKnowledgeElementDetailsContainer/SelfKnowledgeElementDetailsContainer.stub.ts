export const SelfKnowledgeElementDetailsContainerStub = defineComponent({
  name: 'SelfKnowledgeElementDetailsContainer',
  props: ['elementTitle'],
  template: `
    <div class="self-knowledge-element-details-container">
      <slot name="title" />
      <span class="element-title">{{ elementTitle }}</span>
      <slot />
    </div>
  `,
})
