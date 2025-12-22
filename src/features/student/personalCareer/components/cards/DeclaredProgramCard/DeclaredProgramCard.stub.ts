import type { Component } from 'vue'

export const DeclaredProgramCardStub: Component = defineComponent({
  name: 'DeclaredProgramCard',
  props: ['declaredProgram'],
  template: '<div data-testid="declared-program-card-stub"></div>'
})
