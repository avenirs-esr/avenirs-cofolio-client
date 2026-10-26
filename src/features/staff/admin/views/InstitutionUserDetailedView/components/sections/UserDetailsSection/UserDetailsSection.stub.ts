import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const UserDetailsSection = defineComponent({
  name: 'UserDetailsSection',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true
    }
  }
})
