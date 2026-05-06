<script setup lang="ts">
import type { TraceAssociationDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import AssociatedTraceCard from '@/features/student/global/components/cards/AssociatedTraceCard/AssociatedTraceCard.vue'
import AssociationsCard from '@/features/student/global/components/cards/AssociationsCard/AssociationsCard.vue'
import { useI18n } from 'vue-i18n'

export interface AssociatedTracesCardProps {
  associatedTraces: TraceAssociationDTO[]
}

const { associatedTraces } = defineProps<AssociatedTracesCardProps>()

const { t } = useI18n()

const title = computed(() => t('student.buildProject.activities.views.ProjectActivityDetailedView.AssociatedTracesCard.title', { count: associatedTraces.length }))
</script>

<template>
  <AssociationsCard
    v-if="associatedTraces.length > 0"
    :title
    :icon="ICONS.TRACES"
    data-testid="associated-traces-card"
  >
    <AssociatedTraceCard
      v-for="associatedTrace in associatedTraces"
      :key="associatedTrace.trace.traceId"
      :associated-trace="associatedTrace"
    />
  </AssociationsCard>
</template>
