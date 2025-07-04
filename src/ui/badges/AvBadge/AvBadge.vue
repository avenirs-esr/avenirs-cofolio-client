<script setup lang="ts">
/**
 * AvBadge component props.
 */
interface AvBadgeProps {
/**
 * The color of the text to display in the badge.
 */
  color: string

  /**
   * The background color of the badge.
   */
  backgroundColor: string

  /**
   * The color of the badge border.
   */
  borderColor?: string

  /**
   * The link to the public icon in the project (e.g., `/assets/icons/calendar-clock-outline.svg`).
   */
  iconPath?: string

  /**
   * The text to display in the badge.
   */
  label: string

  /**
   * Sets the badge type.
   * @default 'info'
   */
  type?: 'success' | 'error' | 'new' | 'info' | 'warning' | undefined

  /**
   * If true, the badge is displayed without an icon.
   * @default false
   */
  noIcon?: boolean | undefined

  /**
   * If true, displays a reduced-size badge.
   * @default false
   */
  small?: boolean | undefined

  /**
   * If true, the text is truncated with an ellipsis if it is too long.
   * @default false
   */
  ellipsis?: boolean | undefined
}

const props = defineProps<AvBadgeProps>()

const customIconClass = computed(() => props.iconPath ? 'av-badge--customIcon' : undefined)
const styleVars = computed(() => ({
  '--icon-path': `url(${props.iconPath})`,
}))

const color = ref(props.color)
const backgroundColor = ref(props.backgroundColor)
</script>

<template>
  <DsfrBadge
    v-bind="props"
    class="av-badge"
    :class="[customIconClass]"
    :style="styleVars"
  />
</template>

<style lang="scss" scoped>
.av-badge {
  color: v-bind('color');
  background-color: v-bind('backgroundColor');
  border: 1px solid v-bind('borderColor');
}

.av-badge--customIcon::before {
  content: '';
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  mask: var(--icon-path) !important;
  mask-size: contain !important;
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: currentColor !important;
}
</style>
