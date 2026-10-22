import type { PropType } from 'vue'
import type { ExternalSkillDTO, SkillProgressDTO } from '@/api/avenir-esr'

export const StudentDetailedDeclaredSkillCardStub = defineComponent({
  name: 'StudentDetailedDeclaredSkillCard',
  props: {
    declaredSkill: Object as PropType<ExternalSkillDTO | SkillProgressDTO>
  },
  template: '<div class="student-detailed-declared-skill-card-stub"></div>'
})
