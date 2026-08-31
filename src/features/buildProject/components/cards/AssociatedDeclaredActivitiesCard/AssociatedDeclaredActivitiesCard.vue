<script setup lang="ts">
import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import AssociatedActivityCard from '@/features/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.vue'
import AssociationsCard from '@/features/global/components/cards/AssociationsCard/AssociationsCard.vue'
import { useI18n } from 'vue-i18n'

export interface AssociatedDeclaredActivitiesCardProps {
  associatedActivities: DeclaredActivityAssociationDTO[]
  disabled?: boolean
}

const { associatedActivities, disabled } = defineProps<AssociatedDeclaredActivitiesCardProps>()

const { t } = useI18n()

const title = computed(() => t('student.buildProject.activities.cards.AssociatedDeclaredActivitiesCard.title', { count: associatedActivities.length }))
</script>

<template>
  <AssociationsCard
    v-if="associatedActivities.length > 0"
    :title
    :icon="ICONS.ACTIVITY"
    data-testid="associated-declared-activities-card"
  >
    <AssociatedActivityCard
      v-for="associatedActivity in associatedActivities"
      :key="associatedActivity.associationId"
      :declared-activity="associatedActivity.declaredActivity"
      :disabled="disabled"
    />
  </AssociationsCard>
</template>
