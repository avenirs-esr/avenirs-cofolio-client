import type { EAuthorizationEntityType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AuthorizationEntityNameStub = defineComponent({
  name: 'AuthorizationEntityNameStub',
  props: {
    entity: {
      type: Object as PropType<{
        id: string
        name: string
        type: EAuthorizationEntityType
      }>,
      required: true,
    },
    withNav: {
      type: Boolean,
      default: false,
    },
  },
  template: '<div data-testid="entity-name">{{ entity.name }}</div>',
})
