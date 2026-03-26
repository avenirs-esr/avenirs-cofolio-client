import type { PropType } from 'vue'

export const DeclaredProgramCompactCardStub = defineComponent({
  name: 'DeclaredProgramCompactCard',
  props: {
    program: Object as PropType<{ id: string, title: string }>,
    valorized: Boolean
  },
  template: '<div data-testid="declared-program-compact-card-stub"></div>'
})
