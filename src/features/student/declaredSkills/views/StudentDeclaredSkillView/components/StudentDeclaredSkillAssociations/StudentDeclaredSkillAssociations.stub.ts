import type { DeclaredActivityAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'

export const StudentDeclaredSkillAssociationsStub = defineComponent({
  name: 'StudentDeclaredSkillAssociations',
  props: {
    declaredSkillId: {
      type: String,
      required: true
    },
    associatedTraces: {
      type: Array as () => TraceAssociationDTO[],
      required: true
    },
    associatedDeclaredActivities: {
      type: Array as () => DeclaredActivityAssociationDTO[],
      required: true
    },
    associationsError: {
      type: Object as () => BaseApiException | null,
      required: false
    },
    countAssociations: {
      type: Number,
      required: false
    }
  },
  template: '<div class="student-declared-skill-associations-stub" />'
})
