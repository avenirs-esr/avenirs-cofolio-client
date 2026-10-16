import type { PropType } from 'vue'
import type { TraceDeclaredActivityDTO } from '@/api/avenir-esr'

export const ConfirmUpdateTraceModalStub = defineComponent({
  name: 'ConfirmUpdateTraceModalStub',
  props: {
    opened: {
      type: Boolean,
      required: true
    },
    lockedDeclaredActivities: {
      type: Array as PropType<TraceDeclaredActivityDTO[]>,
      required: true
    }
  },
  emits: ['cancel', 'confirm'],
  template: `<div v-if="opened"><p>ConfirmUpdateTraceModalStub</p></div>`
})
