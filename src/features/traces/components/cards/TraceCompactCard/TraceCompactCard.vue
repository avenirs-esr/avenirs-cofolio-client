<script lang="ts" setup>
import type { IdTitle } from '@/types'
import { ICONS } from '@/common/constants'
import { FloatingIconCard } from '@/features/global'

export interface TraceCompactCardProps {
  trace: IdTitle
}

const { trace } = defineProps<TraceCompactCardProps>()

const iconOptions = computed(() => ({
  name: ICONS.TRACES,
  color: 'var(--icon)',
  bottom: '-2.5rem',
  borderColor: 'var(--other-border-skill-card)'
}))
</script>

<template>
  <FloatingIconCard
    :title="trace.title"
    title-color="var(--text1)"
    color="var(--light-background-neutral)"
    :icon-options="iconOptions"
    border-color="var(--other-border-skill-card)"
    :header-rows="2"
    height="7.5rem"
    title-typography-classes="caption-regular"
  />
</template>
