<script setup lang="ts">
const { color = '--foreground-text1', icon, text, typographyClass = 'b2-regular', gap = '0.25rem' } = defineProps<{
  color?: string
  icon: string
  text: string
  typographyClass?: string
  gap?: string
}>()

const computedColor = computed(() => `var(${color})`)
</script>

<template>
  <div class="icon-text--container">
    <VIcon
      :name="icon"
      :color="computedColor"
    />
    <span
      class="icon-text--text"
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
  gap: v-bind('gap');
}

.icon-text--text {
  color: v-bind('color')
}
</style>
