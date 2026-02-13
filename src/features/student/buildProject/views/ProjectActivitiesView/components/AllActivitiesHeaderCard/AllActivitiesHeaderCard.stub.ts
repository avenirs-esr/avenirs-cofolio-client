export const AllActivitiesHeaderCardStub = defineComponent({
  name: 'AllActivitiesHeaderCard',
  emits: ['seeAllEvents'],
  template: '<button @click="$emit(\'seeAllEvents\')">Voir toutes les activités</button>'
})
