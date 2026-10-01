import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const AssociatedDeclaredExperienceCardStub = defineComponent({
  name: 'AssociatedDeclaredExperienceCard',
  props: {
    ...AvInteractivePropsStub,
    declaredExperience: {
      type: Object as PropType<DeclaredExperienceViewDTO>,
      required: true
    },
  },
  template: '<div data-testid="associated-declared-experience-card"></div>'
})
