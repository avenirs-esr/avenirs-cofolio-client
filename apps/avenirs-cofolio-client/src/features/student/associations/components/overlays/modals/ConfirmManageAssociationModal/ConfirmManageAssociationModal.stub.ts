import type { PropType } from 'vue'
import type { Association } from '@/features/student/associations/types/associations.types'

export const ConfirmManageAssociationModalStub = defineComponent({
  name: 'ConfirmManageAssociationModal',
  props: {
    opened: { type: Boolean, required: true },
    items: { type: Array as PropType<Association[]>, required: true },
    title: { type: String, required: true }
  },
  emits: ['cancel', 'confirm'],
  template: '<div data-testid="confirm-manage-association-modal-stub" />'
})
