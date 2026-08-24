import type { Association } from '@/features/student/global/types/associations.types'
import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import type { PropType } from 'vue'

export const AssociateElementsDrawerSectionStub = defineComponent({
  name: 'AssociateElementsDrawerSection',
  props: {
    activeTypeKey: {
      type: String,
      required: true
    },
    activeSubTypeKey: {
      type: String,
      required: false
    },
    searchQuery: {
      type: String,
      default: ''
    },
    selectionsByType: {
      type: Object as PropType<Record<string, Association[]>>,
      default: () => ({})
    },
    typeConfigs: {
      type: Array as PropType<AssociateElementTypeConfig[]>,
      required: true
    },
    options: {
      type: Array as PropType<Association[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'horizontal'
    }
  },
  emits: ['update:activeTypeKey', 'update:activeSubTypeKey', 'update:searchQuery', 'update:selectionsByType'],
  template: '<div data-testid="associate-elements-drawer-section-stub"></div>'
})
