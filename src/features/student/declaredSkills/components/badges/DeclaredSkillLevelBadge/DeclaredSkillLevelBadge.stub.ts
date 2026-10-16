import type { PropType } from 'vue'
import type { EDeclaredSkillLevel } from '@/api/avenir-esr'

export const DeclaredSkillLevelBadgeStub = defineComponent({
  name: 'DeclaredSkillLevelBadge',
  props: {
    level: String as PropType<EDeclaredSkillLevel>,
    small: { type: Boolean, required: false }
  },
  template: '<div data-testid="declared-skill-level-badge" />'
})
