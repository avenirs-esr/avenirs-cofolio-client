<script setup lang="ts">
import type { DeclaredActivityViewDTO } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { ICONS, ROUTES } from '@/common/constants'
import AssociationCard from '@/features/student/global/components/cards/AssociationCard/AssociationCard.vue'

export interface AssociatedActivityCardProps {
  declaredActivity: DeclaredActivityViewDTO
  disabled?: boolean
}

const { declaredActivity, disabled } = defineProps<AssociatedActivityCardProps>()
</script>

<template>
  <AssociationCard
    :title="declaredActivity.title"
    :icon="ICONS.ACTIVITY"
    color="var(--icon)"
    hover-border-color="var(--dark-background-neutral)"
    icon-border-color="var(--other-border-skill-card)"
    background-color="var(--surface-background)"
    :to="{ name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name, params: { id: declaredActivity.id, thematic: declaredActivity.thematic } }"
    :disabled="disabled"
    data-testid="associated-declared-activity-card"
  >
    <template #body>
      <ActivityThematicBadge
        data-testid="activity-association-card-thematic-badge"
        :thematic="declaredActivity.thematic"
      />
      <DeclaredActivityStatusBadge :status="declaredActivity.status" />
    </template>
    <template #footer>
      <div class="av-hidden av-unhidden--md av-px-xs w-full">
        <span
          data-testid="activity-association-card-summary"
          class="activity-summary av-text-text2 caption-light"
        >
          {{ declaredActivity.summary }}
        </span>
      </div>
    </template>
  </AssociationCard>
</template>

<style lang="scss" scoped>
.activity-summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
