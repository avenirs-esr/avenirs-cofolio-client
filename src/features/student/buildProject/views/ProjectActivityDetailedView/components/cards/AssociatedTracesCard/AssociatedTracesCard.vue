<script setup lang="ts">
import type { DeclaredActivityTraceAssociationDTO } from '@/api/avenir-esr'
import AssociatedTraceCard from '@/features/student/global/components/cards/AssociatedTraceCard/AssociatedTraceCard.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvCard, AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedTracesCardProps {
  associatedTraces: DeclaredActivityTraceAssociationDTO[]
}

defineProps<AssociatedTracesCardProps>()

const { t } = useI18n()
</script>

<template>
  <AvCard
    v-if="associatedTraces.length > 0"
    background-color="var(--card2)"
    title-background="var(--card2)"
    border-color="var(--other-border-skill-card)"
    collapsible
    collapsed
    data-testid="associated-trace-card"
  >
    <template #title>
      <div class="av-row av-flex-fill av-justify-start">
        <AvIconText
          typography-class="n4"
          :icon="ICONS.TRACES"
          icon-color="var(--text2)"
          :text="t('student.buildProject.activities.views.ProjectActivityDetailedView.AssociatedTracesCard.title', { count: associatedTraces.length })"
          text-color="var(--text1)"
          gap="var(--spacing-sm)"
          data-testid="associated-trace-card-title"
        />
      </div>
    </template>

    <div class="av-row av-wrap av-align-center av-justify-center av-gap-md">
      <AssociatedTraceCard
        v-for="associatedTrace in associatedTraces"
        :key="associatedTrace.trace.traceId"
        :associated-trace="associatedTrace"
      />
    </div>
  </AvCard>
</template>
