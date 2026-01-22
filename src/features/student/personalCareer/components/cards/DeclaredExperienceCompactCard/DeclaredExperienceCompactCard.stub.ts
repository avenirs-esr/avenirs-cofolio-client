import type { Component } from 'vue'

export const DeclaredExperienceCompactCardStub: Component = defineComponent({
  name: 'DeclaredExperienceCompactCard',
  props: ['title', 'valorized', 'iconName'],
  template: '<div data-testid="declared-experience-compact-card-stub"></div>'
})
