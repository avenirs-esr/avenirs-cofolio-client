<script lang="ts" setup>
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { TraceAssociationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import AssociationCard from '@/features/student/associations/components/cards/AssociationCard/AssociationCard.vue'
import { getTraceComplementaryInfo } from '@/features/student/traces/utils/trace.utils'

export interface AssociatedTraceCardProps extends AvInteractiveProps {
  associatedTrace: TraceAssociationDTO
}

const { associatedTrace, disabled } = defineProps<AssociatedTraceCardProps>()

const complementaryInfo = computed(() => getTraceComplementaryInfo(associatedTrace.trace))
</script>

<template>
  <AssociationCard
    :title="associatedTrace.trace.title"
    :context-type="EAssociationContextType.TRACE"
    :to="{ name: ROUTES.STUDENT.TOOLS_TRACE.name, params: { id: associatedTrace.trace.id } }"
    :disabled="disabled"
    :disabled-tooltip
    data-testid="associated-trace-card"
    :data-trace-id="associatedTrace.trace.id"
  >
    <template
      v-if="complementaryInfo"
      #body
    >
      <span
        class="b2-regular"
        data-testid="associated-trace-card-info"
      >{{ complementaryInfo }}</span>
    </template>
  </AssociationCard>
</template>
