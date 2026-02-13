export const AllActivitiesHeaderCardStub = defineComponent({
  name: 'AllActivitiesHeaderCard',
  emits: ['seeAllActivities'],
  template: '<button data-testid="see-all-activities-button" @click="$emit(\'seeAllActivities\')">Voir toutes les activités</button>'
})
