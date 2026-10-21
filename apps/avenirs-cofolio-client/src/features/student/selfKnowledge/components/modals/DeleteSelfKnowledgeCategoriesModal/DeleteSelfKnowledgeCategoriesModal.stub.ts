export const DeleteSelfKnowledgeCategoriesModalStub = defineComponent({
  name: 'DeleteSelfKnowledgeCategoriesModal',
  props: { opened: Boolean },
  emits: ['cancel', 'deleted'],
  template: '<div v-if="opened" data-testid="delete-self-knowledge-categories-modal" />'
})
