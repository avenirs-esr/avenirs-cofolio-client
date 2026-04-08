import type { DeclaredSkillAssociationDTO } from '@/api/avenir-esr'

export const AssociatedDeclaredSkillsCardStub = defineComponent({
  name: 'AssociatedDeclaredSkillsCard',
  props: {
    associatedDeclaredSkills: {
      type: Object as () => DeclaredSkillAssociationDTO[],
      required: true
    }
  },
  template: `
    <div data-testid="associated-declared-skill-card">
    </div>
  `
})
