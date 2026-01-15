export const DeleteDeclaredProgramConfirmModalStub = defineComponent({
  name: 'DeleteDeclaredProgramConfirmModal',
  props: ['show', 'declaredProgramIds'],
  emits: ['cancel', 'confirm'],
  template: `<div class="delete-declared-program-confirm-modal-stub"></div>`
})
