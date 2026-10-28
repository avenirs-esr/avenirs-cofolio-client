import type { PropType } from 'vue'
import type { ContextualAuthorizationDTO } from '@/api/avenir-esr'

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
