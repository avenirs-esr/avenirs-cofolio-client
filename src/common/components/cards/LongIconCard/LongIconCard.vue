<script lang="ts" setup>
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import Card from '@/common/components/cards/Card/Card.vue'
import { AvIcon, type AvIconProps } from '@avenirs-esr/avenirs-dsav'

export interface LongIconCardProps {
  title: string
  icon: Pick<AvIconProps, 'name' | 'color'>
  iconBackgroundColor?: string
  to?: string | RouteLocationRaw
}

const { title, icon, iconBackgroundColor = 'var(--light-background-neutral)', to } = defineProps<LongIconCardProps>()

defineSlots<{
  default?: Slot
}>()

const componentToRender = computed(() => to ? 'RouterLink' : 'div')
</script>

<template>
  <component
    :is="componentToRender"
    :to="to"
    class="long-icon-card av-radius-lg"
    :class="{ 'long-icon-card--hoverable': !!to }"
    data-testid="long-icon-card"
  >
    <Card>
      <div class="av-row av-gap-xs av-align-center">
        <div class="icon-container av-p-xs av-radius-md">
          <AvIcon
            v-bind="icon"
            :size="1.5"
          />
        </div>
        <div class="av-col av-gap-xs">
          <span
            class="title b1-regular av-text-text1 av-max-lines"
            data-testid="long-icon-card-title"
          >
            {{ title }}
          </span>
          <slot />
        </div>
      </div>
    </Card>
  </component>
</template>

<style lang="scss" scoped>
.long-icon-card {
  .av-card {
    border-radius: var(--radius-lg) !important;
    padding: var(--spacing-xs) !important;
  }

  .icon-container {
    background-color: v-bind(iconBackgroundColor);
    height: fit-content;
  }

  .title {
    --max-lines: 1;
  }

  &--hoverable {
    .av-card:hover {
      border: 1px solid v-bind('icon.color ?? "currentColor"') !important;
      box-shadow: 0 0 0 2px v-bind('icon.color ?? "currentColor"') !important;
    }
  }
}
</style>
