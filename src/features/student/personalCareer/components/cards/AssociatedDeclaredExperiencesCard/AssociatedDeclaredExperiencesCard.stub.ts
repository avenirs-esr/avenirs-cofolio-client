import type { DeclaredExperienceAssociationDTO } from '@/api/avenir-esr'

export const AssociatedDeclaredExperiencesCardStub = defineComponent({
  name: 'AssociatedDeclaredExperiencesCard',
  props: {
    associatedExperiences: {
      type: Array as () => DeclaredExperienceAssociationDTO[],
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  template: `
    <div v-if="associatedExperiences.length > 0" data-testid="associated-declared-experiences-card-stub">
      <span v-for="experience in associatedExperiences" :key="experience.associationId" data-testid="associated-declared-experience">{{ experience.declaredExperience.title }}</span>
    </div>
  `
})
