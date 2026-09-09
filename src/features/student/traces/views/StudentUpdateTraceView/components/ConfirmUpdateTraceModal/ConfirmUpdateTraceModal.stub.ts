import type { TraceDeclaredActivityDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

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
