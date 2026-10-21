import type { PropType } from 'vue'
import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'

export const ValorizedDeclaredProgramItemStub = defineComponent({
  name: 'ValorizedDeclaredProgramItem',
  template: '<div data-testid="valorized-declared-program-item-stub" />',
  props: {
    declaredProgram: { type: Object as PropType<DeclaredProgramViewDTO>, required: true }
  }
})
