import type { PropType } from 'vue'
import type { Association } from '@/features/student/associations/types/associations.types'

export const PendingItemsListStub = defineComponent({
  name: 'PendingItemsList',
  props: {
    items: { type: Array as PropType<Association[]>, required: true }
  },
  template: '<div data-testid="pending-items-list-stub" />'
})
