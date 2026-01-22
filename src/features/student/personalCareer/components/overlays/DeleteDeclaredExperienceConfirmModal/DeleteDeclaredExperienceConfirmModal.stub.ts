export const DeleteDeclaredExperienceConfirmModalStub = defineComponent({
  name: 'DeleteDeclaredExperienceConfirmModal',
  props: ['show', 'declaredExperienceIds'],
  emits: ['close', 'confirm'],
  template: `<div class="delete-declared-experience-confirm-modal-stub"></div>`
})
