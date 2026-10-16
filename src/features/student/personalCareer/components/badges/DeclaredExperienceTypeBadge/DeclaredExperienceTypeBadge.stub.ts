import type { PropType } from 'vue'
import type { EExperienceType } from '@/api/avenir-esr'

export const DeclaredExperienceTypeBadgeStub = defineComponent({
  name: 'DeclaredExperienceTypeBadge',
  props: {
    experienceType: {
      type: String as PropType<EExperienceType>,
      required: true
    }
  },
  template: '<div data-testid="declared-experience-type-badge-stub">{{ experienceType }}</div>'
})
