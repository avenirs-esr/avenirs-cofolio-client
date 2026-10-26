import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const UserProgramsSection = defineComponent({
  name: 'UserProgramsSection',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true
    }
  }
})
