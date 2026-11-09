import type { ContextualAuthorizationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UserContextualAuthorizationsTableStub = defineComponent({
  name: 'UserContextualAuthorizationsTableStub',
  props: {
    contextualAuthorizations: {
      type: Array as PropType<ContextualAuthorizationDTO[]>,
      required: true,
    },
  },
  template: '<div data-testid="user-contextual-authorizations-table-stub" />',
})
