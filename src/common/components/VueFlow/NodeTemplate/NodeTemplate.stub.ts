import type { Node } from '@vue-flow/core'
import type { PropType } from 'vue'

export const NodeTemplateStub = defineComponent({
  name: 'NodeTemplate',
  props: {
    id: { type: String, required: true },
    type: { type: String },
    data: { type: Object as PropType<Node['data']> },
    collapsible: { type: Boolean, default: false },
    withoutDropdown: { type: Boolean, default: false },
    titleOnly: { type: Boolean, default: false },
    withProfileUpdate: { type: Boolean, default: false }
  },
  emits: ['remove', 'updateInProfile'],
  template: '<div>{{ data.label }}<slot name="title" /><slot /></div>',
})
