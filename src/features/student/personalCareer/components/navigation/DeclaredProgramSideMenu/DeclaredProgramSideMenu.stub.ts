import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeclaredProgramSideMenuStub = defineComponent({
  name: 'DeclaredProgramSideMenu',
  props: {
    selectedProgramId: String,
    programs: Array as PropType<DeclaredProgramViewDTO[]>,
    countPrograms: Number
  },
  template: '<div data-testid="declared-program-side-menu-stub"></div>'
})
