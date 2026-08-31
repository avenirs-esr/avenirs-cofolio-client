import type { AssociationElementsDropdownItem } from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import type { PropType } from 'vue'

export const AssociationElementsDropdownStub = defineComponent({
  name: 'AssociationElementsDropdown',
  props: {
    variant: {
      type: String as PropType<'associate' | 'delete'>,
      required: true
    },
    items: {
      type: Array as PropType<AssociationElementsDropdownItem[]>,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select'],
  template: '<div class="association-elements-dropdown-stub" />'
})
