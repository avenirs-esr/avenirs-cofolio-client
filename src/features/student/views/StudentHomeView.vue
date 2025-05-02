<script setup lang="ts">
import StudentEventsCard from '../components/StudentEventsCard.vue'
import StudentOverviewCard from '../components/StudentOverviewCard.vue'
import StudentPagesCard from '../components/StudentPagesCard.vue'
import StudentResumesCard from '../components/StudentResumesCard.vue'
import StudentSkillCards from '../components/StudentSkillCards.vue'
</script>

<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-4">
        <StudentOverviewCard />
        <StudentEventsCard />
        <StudentResumesCard />
        <StudentPagesCard />
      </div>
      <div class="fr-col-8">
        <StudentSkillCards />
      </div>
    </div>
  </div>
</template>
