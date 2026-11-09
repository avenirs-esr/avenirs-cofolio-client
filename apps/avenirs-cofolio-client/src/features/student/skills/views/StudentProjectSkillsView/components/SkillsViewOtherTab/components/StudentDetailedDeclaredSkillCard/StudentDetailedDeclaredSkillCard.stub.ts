import type { ExternalSkillDTO, SkillProgressDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const StudentDetailedDeclaredSkillCardStub = defineComponent({
  name: 'StudentDetailedDeclaredSkillCard',
  props: {
    declaredSkill: Object as PropType<ExternalSkillDTO | SkillProgressDTO>
  },
  template: '<div class="student-detailed-declared-skill-card-stub"></div>'
})
