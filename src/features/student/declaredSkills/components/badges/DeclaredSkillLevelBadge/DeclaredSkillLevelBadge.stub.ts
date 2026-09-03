import type { EDeclaredSkillLevel } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeclaredSkillLevelBadgeStub = defineComponent({
  name: 'DeclaredSkillLevelBadge',
  props: {
    level: String as PropType<EDeclaredSkillLevel>,
    small: { type: Boolean, required: false }
  },
  template: '<div data-testid="declared-skill-level-badge" />'
})
