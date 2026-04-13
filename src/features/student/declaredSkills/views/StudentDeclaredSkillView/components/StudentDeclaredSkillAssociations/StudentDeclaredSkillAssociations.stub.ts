import type { DeclaredActivityAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'

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
    }
  },
  template: '<div class="student-declared-skill-associations-stub" />'
})
