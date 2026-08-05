export const DeleteSelfKnowledgeElementsModalStub = defineComponent({
  name: 'DeleteSelfKnowledgeElementsModal',
  props: {
    show: Boolean,
    categoryType: String,
    totalCount: Number
  },
  emits: ['cancel', 'confirm'],
  template: '<div data-testid="delete-self-knowledge-elements-modal" />'
})
