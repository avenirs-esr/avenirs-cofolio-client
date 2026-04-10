<script setup lang="ts">
import type { DeclaredActivityAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'
import { AssociatedDeclaredActivitiesCard } from '@/features/student/buildProject'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'

const { associatedTraces, associatedDeclaredActivities } = defineProps<{ associatedDeclaredActivities: DeclaredActivityAssociationDTO[], associatedTraces: TraceAssociationDTO[] }>()
</script>

<template>
  <div class="student-declared-skill-associations-container">
    <div
      class="av-col av-gap-xl av-pt-xl"
      data-testid="declared-skill-associations"
    >
      <AssociatedTracesCard :associated-traces="associatedTraces" />
      <AssociatedDeclaredActivitiesCard :associated-activities="associatedDeclaredActivities" />
    </div>
  </div>
</template>
