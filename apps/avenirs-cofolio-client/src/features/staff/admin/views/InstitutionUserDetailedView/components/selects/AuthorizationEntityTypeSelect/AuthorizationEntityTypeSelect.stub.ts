import type { PropType } from 'vue'
import type { EAuthorizationEntityType } from '@/api/avenir-esr'

export const AuthorizationEntityTypeSelectStub = defineComponent({
  name: 'AuthorizationEntityTypeSelect',
  props: {
    modelValue: {
      type: String as PropType<EAuthorizationEntityType>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="authorization-entity-type-select-stub" />',
})
