import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const UserGroupsSection = defineComponent({
  name: 'UserGroupsSection',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true
    }
  }
})
