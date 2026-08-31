import type { AssociateElementTypeConfig } from '@/features/traces/types/traces.types'
import type { PropType } from 'vue'

export const AssociateElementTypeSelectStub = defineComponent({
  name: 'AssociateElementTypeSelect',
  props: {
    typeConfigs: {
      type: Array as PropType<AssociateElementTypeConfig[]>,
      required: true
    },
    activeTypeKey: {
      type: String,
      required: false
    },
    isSubType: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:activeTypeKey'],
  template: '<div class="associate-element-type-select-stub"></div>'
})
