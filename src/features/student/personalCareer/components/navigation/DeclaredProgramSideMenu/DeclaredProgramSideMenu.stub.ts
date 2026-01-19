import type { Component } from 'vue'

export const DeclaredProgramSideMenuStub: Component = defineComponent({
  name: 'DeclaredProgramSideMenu',
  props: ['selectedProgramId', 'programs', 'countPrograms'],
  template: '<div data-testid="declared-program-side-menu-stub"></div>'
})
