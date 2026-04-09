<script setup lang="ts">
import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import AssociatedActivityCard from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvCard, AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedDeclaredActivitiesCardProps {
  associatedActivities: DeclaredActivityAssociationDTO[]
}

defineProps<AssociatedDeclaredActivitiesCardProps>()

const { t } = useI18n()
</script>

<template>
  <AvCard
    v-if="associatedActivities.length > 0"
    background-color="var(--card2)"
    title-background="var(--card2)"
    border-color="var(--other-border-skill-card)"
    collapsible
    collapsed
    data-testid="associated-declared-activities-card"
  >
    <template #title>
      <div class="av-row av-flex-fill av-justify-start">
        <AvIconText
          typography-class="n4"
          :icon="ICONS.ACTIVITY"
          icon-color="var(--text2)"
          :text="t('student.buildProject.activities.cards.AssociatedDeclaredActivitiesCard.title', { count: associatedActivities.length })"
          text-color="var(--text1)"
          gap="var(--spacing-sm)"
          data-testid="associated-declared-activities-card-title"
          inline
        />
      </div>
    </template>

    <div
      class="av-row av-wrap av-align-center av-gap-md"
      data-testid="associated-declared-activities-cards-container"
    >
      <AssociatedActivityCard
        v-for="associatedActivity in associatedActivities"
        :key="associatedActivity.associationId"
        :declared-activity="associatedActivity.declaredActivity"
      />
    </div>
  </AvCard>
</template>
