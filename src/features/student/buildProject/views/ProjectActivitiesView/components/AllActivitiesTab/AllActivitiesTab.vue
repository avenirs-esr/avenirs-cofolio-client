<script setup lang="ts">
import { useNavigation } from '@/common/composables'
import AllActivitiesHeaderCard from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesHeaderCard/AllActivitiesHeaderCard.vue'

const { navigateToStudentProjectActivitiesCatalog } = useNavigation()
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="all-activities-tab"
  >
    <AllActivitiesHeaderCard @see-all-activities="navigateToStudentProjectActivitiesCatalog" />
  </div>
</template>
