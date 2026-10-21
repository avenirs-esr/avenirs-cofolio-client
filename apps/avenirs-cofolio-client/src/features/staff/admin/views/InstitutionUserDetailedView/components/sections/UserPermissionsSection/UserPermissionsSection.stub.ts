import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const UserPermissionsSection = defineComponent({
  name: 'UserPermissionsSection',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true
    }
  }
})
