import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AssociationContextTypeSelectStub = defineComponent({
  name: 'AssociationContextTypeSelect',
  props: {
    contextTypes: {
      type: Array as PropType<({ type: EAssociationContextType } & AvInteractiveProps)[]>,
      required: true
    },
    modelValue: {
      type: String as PropType<EAssociationContextType | null>,
      required: false
    },
    teleport: {
      type: Boolean,
      required: false
    }
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="association-context-type-select-stub" />'
})
