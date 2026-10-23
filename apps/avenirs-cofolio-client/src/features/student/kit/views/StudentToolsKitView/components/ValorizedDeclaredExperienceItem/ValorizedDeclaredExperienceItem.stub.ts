import type { PropType } from 'vue'
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'

export const ValorizedDeclaredExperienceItemStub = defineComponent({
  name: 'ValorizedDeclaredExperienceItem',
  template: '<div data-testid="valorized-declared-experience-item-stub" />',
  props: {
    declaredExperience: { type: Object as PropType<DeclaredExperienceViewDTO>, required: true }
  }
})
