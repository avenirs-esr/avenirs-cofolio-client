import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const AssociatedDeclaredExperienceCardStub = defineComponent({
  name: 'AssociatedDeclaredExperienceCard',
  props: {
    declaredExperience: {
      type: Object as PropType<DeclaredExperienceViewDTO>,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  template: '<div data-testid="associated-declared-experience-card"></div>'
})
