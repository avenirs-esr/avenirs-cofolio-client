<script lang="ts" setup>
import type { IdTitle } from '@/types'
import { ICONS } from '@/common/constants'
import FloatingIconCard from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'

export interface DeclaredExperienceCompactCardProps {
  experience: IdTitle
}

const { experience } = defineProps<DeclaredExperienceCompactCardProps>()

const iconOptions = computed(() => ({
  name: ICONS.EXPERIENCES,
  color: 'var(--icon)',
  bottom: '-2.5rem',
  borderColor: 'var(--other-border-skill-card)'
}))
</script>

<template>
  <FloatingIconCard
    :title="experience.title"
    title-color="var(--text1)"
    color="var(--light-background-neutral)"
    :icon-options="iconOptions"
    border-color="var(--other-border-skill-card)"
    :header-rows="2"
    height="7.5rem"
    custom-title-height="4rem"
    title-typography-classes="caption-regular"
  />
</template>
