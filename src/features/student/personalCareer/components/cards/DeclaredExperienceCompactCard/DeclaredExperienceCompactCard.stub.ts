import type { PropType } from 'vue'

export const DeclaredExperienceCompactCardStub = defineComponent({
  name: 'DeclaredExperienceCompactCard',
  props: {
    experience: Object as PropType<{ id: string, title: string }>,
    valorized: Boolean
  },
  template: '<div data-testid="declared-experience-compact-card-stub"></div>'
})
