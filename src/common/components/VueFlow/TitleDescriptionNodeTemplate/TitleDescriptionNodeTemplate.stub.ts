import type { Node } from '@vue-flow/core'
import type { PropType } from 'vue'

export const TitleDescriptionNodeTemplateStub = defineComponent({
  name: 'TitleDescriptionNodeTemplate',
  props: {
    data: { type: Object as PropType<Node['data']> },
  },
  emits: ['updateInProfile'],
  template: '<div><h1>{{ data.title }}</h1><p>{{ data.description }}</p><slot /></div>',
})
