<script lang="ts" setup>
import type { DeclaredActivityTraceAssociationDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import AssociationCard from '@/features/student/global/components/cards/AssociationCard/AssociationCard.vue'
import { ICONS } from '@/features/student/global/icons'

export interface AssociatedTraceCardProps {
  associatedTrace: DeclaredActivityTraceAssociationDTO
}

const { associatedTrace } = defineProps<AssociatedTraceCardProps>()
</script>

<template>
  <AssociationCard
    :title="associatedTrace.trace.title"
    :icon="ICONS.TRACES"
    color="var(--text1)"
    background-color="var(--light-background-neutral)"
    hover-border-color="var(--dark-background-primary1)"
    icon-border-color="var(--other-border-skill-card)"
    :to="{ name: ROUTES.STUDENT.TRACE.name, params: { id: associatedTrace.trace.traceId } }"
    data-testid="associated-trace-card"
  />
</template>
