export const ConfirmDeleteSelfKnowledgeElementsModalStub = defineComponent({
  name: 'ConfirmDeleteSelfKnowledgeElementsModal',
  props: ['opened', 'elements'],
  emits: ['cancel', 'confirm'],
  template: `<div class="confirm-delete-self-knowledge-elements-modal-stub"></div>`
})
