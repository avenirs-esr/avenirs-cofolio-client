import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const UserLayoutStub = defineComponent({
  name: 'UserLayout',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true
    }
  },
  template: `
    <div data-testid="user-layout" />
  `,
})
