import type { PropType } from 'vue'
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'

export const DeclaredExperienceCardStub = defineComponent({
  name: 'DeclaredExperienceCard',
  template: '<div class="declared-experience-card-stub" data-testid="declared-experience-card-stub"><slot /></div>',
  props: {
    declaredExperience: {
      type: Object as PropType<DeclaredExperienceViewDTO>,
      required: true
    }
  }
})
