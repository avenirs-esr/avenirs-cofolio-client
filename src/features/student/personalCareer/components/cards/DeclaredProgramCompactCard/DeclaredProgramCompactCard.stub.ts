import type { Component } from 'vue'

export const DeclaredProgramCompactCardStub: Component = defineComponent({
  name: 'DeclaredProgramCompactCard',
  props: ['title', 'valorized', 'iconName'],
  template: '<div data-testid="declared-program-compact-card-stub"></div>'
})
