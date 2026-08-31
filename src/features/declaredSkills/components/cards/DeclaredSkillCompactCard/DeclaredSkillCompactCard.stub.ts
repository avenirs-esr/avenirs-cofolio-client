import type { EExternalSkillType } from '@/api/avenir-esr'
import type { IdTitle } from '@/types'
import type { PropType } from 'vue'

export const DeclaredSkillCompactCardStub = defineComponent({
  name: 'DeclaredSkillCompactCard',
  props: {
    declaredSkill: Object as PropType<IdTitle & { type?: EExternalSkillType }>
  },
  template: '<div data-testid="declared-skill-compact-card-stub" />'
})
