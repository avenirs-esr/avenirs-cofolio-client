export const AddSelfKnowledgeCategoriesModalStub = defineComponent({
  name: 'AddSelfKnowledgeCategoriesModal',
  props: { opened: Boolean },
  emits: ['cancel', 'confirm'],
  template: '<div v-if="opened" data-testid="add-self-knowledge-categories-modal" />'
})
