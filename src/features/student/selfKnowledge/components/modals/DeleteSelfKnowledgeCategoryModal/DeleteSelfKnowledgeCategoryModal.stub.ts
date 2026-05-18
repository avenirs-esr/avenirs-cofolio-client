export const DeleteSelfKnowledgeCategoryModalStub = defineComponent({
  name: 'DeleteSelfKnowledgeCategoryModal',
  props: {
    show: Boolean,
    categoryId: String,
    categoryTitle: String,
    elementsCount: Number
  },
  emits: ['cancel', 'confirm'],
  template: '<div data-testid="delete-self-knowledge-category-modal" />'
})
