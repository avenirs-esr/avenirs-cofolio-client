export const AddSelfKnowledgeCategoriesModalStub = defineComponent({
  name: 'AddSelfKnowledgeCategoriesModal',
  props: { show: Boolean },
  emits: ['cancel', 'confirm'],
  template: `
    <div v-if="show" data-testid="add-self-knowledge-categories-modal" />
  `
})
