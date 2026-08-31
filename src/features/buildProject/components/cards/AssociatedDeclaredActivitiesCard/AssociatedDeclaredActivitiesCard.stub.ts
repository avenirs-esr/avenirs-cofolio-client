import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'

export const AssociatedDeclaredActivitiesCardStub = defineComponent({
  name: 'AssociatedDeclaredActivitiesCard',
  props: {
    associatedActivities: {
      type: Array as () => DeclaredActivityAssociationDTO[],
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  template: `
    <div v-if="associatedActivities.length > 0" data-testid="associated-declared-activities-card-stub">
      <span v-for="activity in associatedActivities" :key="activity.associationId" data-testid="associated-declared-activity">{{ activity.declaredActivity.title }}</span>
    </div>
  `
})
