<script lang="ts" setup>
import type { Slot } from 'vue'
import { AvCard, AvIcon } from '@avenirs-esr/avenirs-dsav'

export interface IconOptions {
  name: string
  color?: string
  bottom?: string
  right?: string
  borderColor?: string
}

export interface FloatingIconCardProps {
  title: string
  iconOptions: IconOptions
  borderColor?: string
  borderColorOnHover?: string
  color?: string
  customTitleHeight?: string
  headerRows?: 1 | 2 | 3
  height?: string
  titleTypographyClasses?: string
}

const {
  iconOptions,
  borderColor = 'var(--other-border-skill-card)',
  borderColorOnHover,
  color = 'var(--light-foreground-primary1)',
  customTitleHeight,
  headerRows = 3,
  height = '16.875rem',
} = defineProps<FloatingIconCardProps>()

defineSlots<{
  body?: Slot
  footer?: Slot
}>()

const iconColor = computed(() => iconOptions.color ?? 'var(--card2)')
const iconBottom = computed(() => iconOptions.bottom ?? '-3rem')
const iconRight = computed(() => iconOptions.right ?? '0')
const iconBorderColor = computed(() => iconOptions.borderColor ?? 'var(--other-background-base)')
const selectedBorderColorOnHover = computed(() => borderColorOnHover ?? color)

const titleHeightPeerRows = {
  1: 'auto',
  2: '4.6875rem',
  3: '6.5625rem'
}
const titleHeight = computed(() => customTitleHeight ?? titleHeightPeerRows[headerRows])
</script>

<template>
  <div class="floating-icon-card">
    <AvCard
      :border-color="borderColor"
      :title-background="color"
      :title-height="titleHeight"
    >
      <template #title>
        <div class="floating-icon-card__title-container">
          <span
            class="floating-icon-card__title"
            :class="titleTypographyClasses"
            :title="title"
          >
            {{ title }}
          </span>
          <div
            class="floating-icon-card__icon"
            :style="{ background: color }"
          >
            <AvIcon
              :name="iconOptions.name"
              :color="iconColor"
              :size="2.0625"
            />
          </div>
        </div>
      </template>
      <template #body>
        <div class="floating-icon-card__body">
          <slot name="body" />
        </div>
      </template>
      <template #footer>
        <div
          v-if="$slots.footer"
          class="floating-icon-card__footer"
        >
          <slot name="footer" />
        </div>
      </template>
    </AvCard>
  </div>
</template>

<style lang="scss" scoped>
.av-card {
  height: v-bind('height');
  width: 100%;
}

.av-card:hover {
  border: 1px solid v-bind('selectedBorderColorOnHover') !important;
  box-shadow: 0 0 0 2px v-bind('selectedBorderColorOnHover');
}

.floating-icon-card {
  display: flex;
  min-width: 17.25rem;
  border-radius: 1.5rem;
  background-image: none;

  &__title-container {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    color: var(--card2);
  }

  &__title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: v-bind('headerRows');
    -webkit-line-clamp: v-bind('headerRows');
    margin-right: 3.125rem;
  }

  &__icon {
    position: absolute;
    width: 3.125rem;
    height: 3.125rem;
    border-radius: var(--radius-lg);
    border: 1px solid v-bind('iconBorderColor');
    right: v-bind('iconRight');
    bottom: v-bind('iconBottom');
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: var(--spacing-xxs);
  }
}
</style>
