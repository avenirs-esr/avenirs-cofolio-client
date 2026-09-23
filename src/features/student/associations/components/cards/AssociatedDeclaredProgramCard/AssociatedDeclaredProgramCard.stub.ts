import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const AssociatedDeclaredProgramCardStub = defineComponent({
  name: 'AssociatedDeclaredProgramCard',
  props: {
    declaredProgram: {
      type: Object as PropType<DeclaredProgramViewDTO>,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  template: '<div data-testid="associated-declared-program-card"></div>'
})
