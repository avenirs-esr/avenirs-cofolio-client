import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const AssociatedDeclaredProgramCardStub = defineComponent({
  name: 'AssociatedDeclaredProgramCard',
  props: {
    ...AvInteractivePropsStub,
    declaredProgram: {
      type: Object as PropType<DeclaredProgramViewDTO>,
      required: true
    },
  },
  template: '<div data-testid="associated-declared-program-card"></div>'
})
