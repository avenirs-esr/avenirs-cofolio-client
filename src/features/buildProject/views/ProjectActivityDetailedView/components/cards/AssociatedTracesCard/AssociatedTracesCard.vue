<script setup lang="ts">
import type { TraceAssociationDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import AssociatedTraceCard from '@/features/global/components/cards/AssociatedTraceCard/AssociatedTraceCard.vue'
import AssociationsCard from '@/features/global/components/cards/AssociationsCard/AssociationsCard.vue'
import { useI18n } from 'vue-i18n'

export interface AssociatedTracesCardProps {
  associatedTraces: TraceAssociationDTO[]
  traceAllowedAssociations?: number
}

const { associatedTraces, traceAllowedAssociations } = defineProps<AssociatedTracesCardProps>()

const { t } = useI18n()

const title = computed(() => {
  const unlimited = traceAllowedAssociations == null || traceAllowedAssociations === -1

  const key = `student.buildProject.activities.views.ProjectActivityDetailedView.AssociatedTracesCard.title${unlimited ? 'Unlimited' : 'Limited'}`

  return t(key, {
    count: associatedTraces.length,
    ...(unlimited
      ? {}
      : { allowedtrace: traceAllowedAssociations }),
  })
})
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
      :key="associatedTrace.trace.id"
      :associated-trace="associatedTrace"
    />
  </AssociationsCard>
</template>
