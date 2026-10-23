export const SelfKnowledgeCategoryBadgeStub = defineComponent({
  name: 'SelfKnowledgeCategoryBadge',
  props: ['categoryType'],
  template: '<div data-testid="self-knowledge-category-badge-stub">{{ categoryType }}</div>'
})
