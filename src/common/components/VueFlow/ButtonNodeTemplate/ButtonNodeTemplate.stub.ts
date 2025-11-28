import type { Node } from '@vue-flow/core'
import type { PropType } from 'vue'

export const ButtonNodeTemplateStub = defineComponent({
  name: 'ButtonNodeTemplate',
  props: {
    id: { type: String, required: true },
    type: { type: String },
    data: { type: Object as PropType<Node['data']> },
    label: { type: String, required: true },
    icon: { type: String, required: false },
    small: { type: Boolean, required: false, default: false },
  },
  emits: ['click'],
  template: '<div><button @click="$emit(\'click\')">{{ label }}</button><slot name="modal" /></div>',
})
