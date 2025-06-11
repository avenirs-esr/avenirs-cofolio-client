<script setup lang="ts">
const {
  textColor = 'var(--foreground-text1)',
  iconColor = 'var(--foreground-text1)',
  icon,
  text,
  typographyClass = 'b2-regular',
  gap = '0.25rem'
} = defineProps<{
  textColor?: string
  iconColor?: string
  icon: string
  text: string
  typographyClass?: string
  gap?: string
}>()

const computedIconScale = computed(() => {
  if (typographyClass.startsWith('n') || typographyClass.startsWith('s')) {
    return '1.5'
  }
  return '1'
})
</script>

<template>
  <div class="icon-text--container ellipsis-container">
    <VIcon
      class="icon-text--icon"
      :name="icon"
      :color="iconColor"
      :scale="computedIconScale"
    />
    <span
      class="icon-text--text ellipsis"
      :class="[typographyClass]"
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
