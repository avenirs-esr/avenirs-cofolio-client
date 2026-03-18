<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import AssociationCard from '@/features/student/global/components/cards/AssociationCard/AssociationCard.vue'
import { ICONS } from '@/features/student/global/icons'

export interface AssociatedSkillCardProps {
  title: string
  to: RouteLocationRaw
}

const { title, to } = defineProps<AssociatedSkillCardProps>()
</script>

<template>
  <AssociationCard
    :title="title"
    :icon="ICONS.SKILLS"
    color="var(--card)"
    background-color="var(--dark-background-primary1)"
    :to="to"
  />
</template>
