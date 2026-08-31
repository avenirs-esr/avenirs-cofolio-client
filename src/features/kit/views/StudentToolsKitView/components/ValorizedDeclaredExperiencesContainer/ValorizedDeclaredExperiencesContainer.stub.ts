import type { EExperienceType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ValorizedDeclaredExperiencesContainerStub = defineComponent({
  name: 'ValorizedDeclaredExperiencesContainer',
  template: '<div data-testid="valorized-declared-experiences-container-stub" />',
  props: {
    experienceType: { type: String as PropType<EExperienceType>, required: true }
  }
})
