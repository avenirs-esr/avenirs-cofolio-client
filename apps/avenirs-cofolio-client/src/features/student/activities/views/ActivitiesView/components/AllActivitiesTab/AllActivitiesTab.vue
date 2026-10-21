<script setup lang="ts">
import AllActivitiesHeaderCard from '@/features/student/activities/views/ActivitiesView/components/AllActivitiesHeaderCard/AllActivitiesHeaderCard.vue'
import AllActivitiesSection from '@/features/student/activities/views/ActivitiesView/components/AllActivitiesSection/AllActivitiesSection.vue'
import NewActivitiesPaginatorCard from '@/features/student/activities/views/ActivitiesView/components/NewActivitiesPaginatorCard/NewActivitiesPaginatorCard.vue'

const allActivitiesSectionRef = useTemplateRef<InstanceType<typeof AllActivitiesSection>>('allActivitiesSectionElement')

function scrollToAllActivitiesSection () {
  allActivitiesSectionRef.value?.$el?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="all-activities-tab"
  >
    <AllActivitiesHeaderCard @see-all-activities="scrollToAllActivitiesSection" />
    <div class="av-col av-gap-5xl">
      <NewActivitiesPaginatorCard />
      <AllActivitiesSection ref="allActivitiesSectionElement" />
    </div>
  </div>
</template>
