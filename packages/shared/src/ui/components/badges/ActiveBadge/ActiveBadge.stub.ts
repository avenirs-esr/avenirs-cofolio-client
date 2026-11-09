import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const ActiveBadgeStub = defineComponent({
  name: 'ActiveBadge',
  props: {
    active: {
      type: Boolean,
      required: false,
    },
    labelGender: {
      type: String as PropType<'FEMININE' | 'MASCULINE' | 'NEUTRAL'>,
      required: false,
    }
  }
})
