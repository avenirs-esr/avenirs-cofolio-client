export const DeleteSelfKnowledgeElementsModalStub = defineComponent({
  name: 'DeleteSelfKnowledgeElementsModal',
  props: {
    show: Boolean,
    categoryId: String,
    totalCount: Number
  },
  emits: ['cancel', 'confirm'],
  template: '<div data-testid="delete-self-knowledge-elements-modal" />'
})
