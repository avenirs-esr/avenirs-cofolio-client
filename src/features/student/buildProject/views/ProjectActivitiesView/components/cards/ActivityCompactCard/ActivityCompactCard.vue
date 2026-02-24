<script lang="ts" setup>
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { ICONS } from '@/features/student/global/icons'

export interface ActivityCompactCardProps {
  title: string
}

defineProps<ActivityCompactCardProps>()

const iconOptions = computed(() => ({
  name: ICONS.ACTIVITY,
  color: 'var(--icon)',
  bottom: '-2.5rem',
  borderColor: 'var(--other-border-skill-card)'
}))
</script>

<template>
  <FloatingIconCard
    :title="title"
    title-color="var(--text1)"
    color="var(--surface-background)"
    :icon-options="iconOptions"
    border-color="var(--other-border-skill-card)"
    :header-rows="2"
    height="5.75rem"
    title-typography-classes="caption-regular"
  />
</template>

<style lang="scss" scoped>
.floating-icon-card {
  min-width: 13.75rem !important;
  max-width: 13.75rem !important;
}
</style>
