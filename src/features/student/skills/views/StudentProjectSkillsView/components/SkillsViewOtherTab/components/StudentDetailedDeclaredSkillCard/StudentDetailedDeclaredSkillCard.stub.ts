import type { PropType } from 'vue'
import type { DeclaredSkillProgressDTO, ExternalSkillDTO } from '@/api/avenir-esr'

export const StudentDetailedDeclaredSkillCardStub = defineComponent({
  name: 'StudentDetailedDeclaredSkillCard',
  props: {
    declaredSkill: Object as PropType<ExternalSkillDTO | DeclaredSkillProgressDTO>
  },
  template: '<div class="student-detailed-declared-skill-card-stub"></div>'
})
