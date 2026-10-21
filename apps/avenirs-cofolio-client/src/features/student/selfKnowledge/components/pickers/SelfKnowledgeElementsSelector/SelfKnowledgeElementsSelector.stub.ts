export const SelfKnowledgeElementsSelectorStub = defineComponent({
  name: 'SelfKnowledgeElementsSelector',
  props: ['elements', 'categoryType', 'modelValue'],
  emits: ['update:modelValue'],
  template: `<div class="self-knowledge-element-selector-stub"></div>`
})
