<script setup lang="ts">
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'

/**
 * AvIconText component props.
 */
export interface AvIconTextProps {
  /**
   * The text color.
   * @default 'var(--text1)'
   */
  textColor?: string

  /**
   * The icon color.
   * @default 'var(--text1)'
   */
  iconColor?: string

  /**
   * The icon name according to the naming convention defined for `VIcon` on VueDSFR.
   */
  icon: string

  /**
   * The text to display.
   */
  text: string

  /**
   * The typography class to use for the text.
   * @default 'b2-regular'
   */
  typographyClass?: string

  /**
   * The space between the icon and the text.
   * @default '0.25rem'
   */
  gap?: string

  /**
   * If `false`, text that is too long will be truncated.
   * @default false
   */
  inline?: boolean
}

const {
  textColor = 'var(--text1)',
  iconColor = 'var(--text1)',
  icon,
  text,
  typographyClass = 'b2-regular',
  gap = 'var(--spacing-xxs)',
  inline = false
} = defineProps<AvIconTextProps>()

const iconSize = computed(() => {
  if (typographyClass.startsWith('n') || typographyClass.startsWith('s')) {
    return 2
  }
  return 1.3125
})

const ellipsisContainerClass = computed(() => !inline ? 'ellipsis-container' : undefined)
const ellipsisClass = computed(() => !inline ? 'ellipsis' : undefined)
</script>

<template>
  <div
    class="icon-text--container"
    :class="[ellipsisContainerClass]"
  >
    <AvVIcon
      class="icon-text--icon"
      :name="icon"
      :color="iconColor"
      :size="iconSize"
    />
    <span
      class="icon-text--text"
      :class="[ellipsisClass, typographyClass]"
    >
      {{ text }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.icon-text--container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: v-bind('gap');
}

.icon-text--text {
  color: v-bind('textColor')
}

.icon-text--text {
  color: v-bind('textColor')
}
</style>
