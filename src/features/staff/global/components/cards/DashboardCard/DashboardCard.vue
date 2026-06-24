<script setup lang="ts">
import { AvCard, AvIcon } from '@avenirs-esr/avenirs-dsav'

export interface DashboardCardProps {
  icon: string
  value: string
  label: string
}

defineProps<DashboardCardProps>()
</script>

<template>
  <AvCard
    class="dashboard-card"
    data-testid="dashboard-card"
    title-background="var(--card)"
  >
    <template #title>
      <div class="icon-container av-col av-align-center av-justify-center av-radius-lg av-p-sm av-radius-md">
        <AvIcon
          :name="icon"
          color="var(--contrast-foreground)"
          :size="1.5"
        />
      </div>
    </template>

    <template #body>
      <div class="av-col">
        <span
          class="n3"
          data-testid="dashboard-card-value"
        >
          {{ value }}
        </span>
        <span
          class="b2-regular av-text-text2"
          data-testid="dashboard-card-label"
        >
          {{ label }}
        </span>
      </div>
    </template>
  </AvCard>
</template>

<style scoped lang="scss">
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.dashboard-card {
  @include dsav.min-width(md) {
    width: 20rem;
  }
  min-height: 13rem;

  .icon-container {
    width: var(--dimension-sm);
    height: var(--dimension-sm);
    background-color: var(--dark-background-primary1);
  }
}
</style>
