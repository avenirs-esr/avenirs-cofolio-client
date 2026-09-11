export const SelfKnowledgeElementTabsStub = defineComponent({
  name: 'SelfKnowledgeElementTabs',
  props: {
    categoryType: {
      type: [String, Number],
      required: true
    }
  },
  template: `
    <div class="self-knowledge-element-tabs-stub">
      <slot name="element" />
      <slot name="associations" />
    </div>
  `
})
