import type { AssociationElementsDropdownItem } from '@/features/student/associations/components/interactions/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const AssociationElementsDropdownStub = defineComponent({
  name: 'AssociationElementsDropdown',
  props: {
    ...AvInteractivePropsStub,
    variant: {
      type: String as PropType<'associate' | 'delete'>,
      required: true
    },
    items: {
      type: Array as PropType<AssociationElementsDropdownItem[]>,
      required: true
    },
  },
  emits: ['select'],
  template: '<div class="association-elements-dropdown-stub" />'
})
