import type { EAuthorizationEntityType, ExternalUserDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AuthorizationEntityTypeSelectStub = defineComponent({
  name: 'AuthorizationEntityTypeSelect',
  props: {
    modelValue: {
      type: String as PropType<EAuthorizationEntityType | undefined>,
      default: undefined,
    },
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="authorization-entity-type-select-stub" />',
})
