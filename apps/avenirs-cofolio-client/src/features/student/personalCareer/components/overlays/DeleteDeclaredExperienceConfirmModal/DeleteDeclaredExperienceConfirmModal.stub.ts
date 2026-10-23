import type { PropType } from 'vue'

export const DeleteDeclaredExperienceConfirmModalStub = defineComponent({
  name: 'DeleteDeclaredExperienceConfirmModal',
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    declaredExperienceIds: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ['close', 'confirm'],
  template: `<div class="delete-declared-experience-confirm-modal-stub"></div>`
})
