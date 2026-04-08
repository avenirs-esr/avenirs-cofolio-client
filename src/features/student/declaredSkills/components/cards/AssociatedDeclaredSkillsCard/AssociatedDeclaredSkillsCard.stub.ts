import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'

export const AssociatedSkillCardStub = defineComponent({
  name: 'AssociatedSkillCard',
  props: {
    associatedSkill: {
      type: Object as () => DeclaredActivityAssociationDTO,
      required: true
    }
  },
  template: `
    <div data-testid="associated-skill-card">
      <span>{{ associatedSkill.declaredActivity.title }}</span>
    </div>
  `
})
