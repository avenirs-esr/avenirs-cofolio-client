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
  titleColor?: string
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
  titleColor = 'var(--card2)',
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
  <div class="floating-icon-card av-row">
    <AvCard
      :border-color="borderColor"
      :title-background="color"
      :title-height="titleHeight"
    >
      <template #title>
        <div class="floating-icon-card__title-container av-w-full av-h-full">
          <span
            class="floating-icon-card__title av-mr-4xl"
            :class="titleTypographyClasses"
            :title="title"
            data-testid="floating-icon-card-title"
          >
            {{ title }}
          </span>
          <div
            class="floating-icon-card__icon av-row av-align-center av-justify-center av-radius-lg av-border-width-sm av-border-style-solid"
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
        <div class="floating-icon-card__body av-col av-gap-sm">
          <slot name="body" />
        </div>
      </template>
      <template
        v-if="$slots.footer"
        #footer
      >
        <div class="floating-icon-card__footer av-row av-align-center av-wrap av-gap-xxs">
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
  min-width: 17.25rem;
  border-radius: 1.5rem;

  &__title-container {
    position: relative;
    display: block;
  }

  &__title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: v-bind('headerRows');
    -webkit-line-clamp: v-bind('headerRows');
    color: v-bind('titleColor');
  }

  &__icon {
    position: absolute;
    width: 3.125rem;
    height: 3.125rem;
    border-color: v-bind('iconBorderColor');
    right: v-bind('iconRight');
    bottom: v-bind('iconBottom');
  }
}
</style>
