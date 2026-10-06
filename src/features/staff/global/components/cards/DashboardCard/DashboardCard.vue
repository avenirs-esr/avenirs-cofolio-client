<script setup lang="ts">
import type { Slot } from 'vue'
import { AvCard, AvIcon } from '@avenirs-esr/avenirs-dsav'

export interface DashboardCardProps {
  icon: string
  value: string
  label: string
}

defineProps<DashboardCardProps>()

const slots = defineSlots<{
  footer?: Slot
}>()
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

    <template
      v-if="slots.footer"
      #footer
    >
      <div
        class="av-row av-justify-end"
        data-testid="dashboard-card-footer"
      >
        <slot name="footer" />
      </div>
    </template>
  </AvCard>
</template>

<style scoped lang="scss">
.dashboard-card {
  width: 16.53125rem;
  height: 16.0625rem;

  .icon-container {
    width: var(--dimension-sm);
    height: var(--dimension-sm);
    background-color: var(--dark-background-primary1);
  }
}
</style>
