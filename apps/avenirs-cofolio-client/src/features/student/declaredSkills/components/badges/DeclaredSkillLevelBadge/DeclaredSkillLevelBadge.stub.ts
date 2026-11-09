import type { ESkillLevel } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const DeclaredSkillLevelBadgeStub = defineComponent({
  name: 'DeclaredSkillLevelBadge',
  props: {
    level: String as PropType<ESkillLevel>,
    small: { type: Boolean, required: false }
  },
  template: '<div data-testid="declared-skill-level-badge" />'
})
