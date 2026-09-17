<script lang="ts" setup>
import type { TraceAssociationDTO } from '@/api/avenir-esr'
import { ICONS, ROUTES } from '@/common/constants'
import AssociationCard from '@/features/student/global/components/cards/AssociationCard/AssociationCard.vue'

export interface AssociatedTraceCardProps {
  associatedTrace: TraceAssociationDTO
  disabled?: boolean
}

const { associatedTrace, disabled } = defineProps<AssociatedTraceCardProps>()
</script>

<template>
  <AssociationCard
    :title="associatedTrace.trace.title"
    :icon="ICONS.TRACES"
    color="var(--text1)"
    background-color="var(--light-background-neutral)"
    hover-border-color="var(--dark-background-primary1)"
    icon-border-color="var(--other-border-skill-card)"
    :to="{ name: ROUTES.STUDENT.TOOLS_TRACE.name, params: { id: associatedTrace.trace.id } }"
    :disabled="disabled"
    data-testid="associated-trace-card"
    :data-trace-id="associatedTrace.trace.id"
  />
</template>
