<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import AssociationCard from '@/features/student/global/components/cards/AssociationCard/AssociationCard.vue'
import { ICONS } from '@/features/student/global/icons'

export interface AssociatedTraceCardProps {
  title: string
  to: RouteLocationRaw
}

const { title, to } = defineProps<AssociatedTraceCardProps>()
</script>

<template>
  <AssociationCard
    :title="title"
    :icon="ICONS.TRACES"
    color="var(--text1)"
    background-color="var(--light-background-neutral)"
    hover-border-color="var(--dark-background-primary1)"
    icon-border-color="var(--other-border-skill-card)"
    :to="to"
  />
</template>
