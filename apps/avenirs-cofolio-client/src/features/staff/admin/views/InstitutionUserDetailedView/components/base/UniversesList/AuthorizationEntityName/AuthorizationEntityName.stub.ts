import type { PropType } from 'vue'
import type { EAuthorizationEntityType } from '@/api/avenir-esr'

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
