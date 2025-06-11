<script setup lang="ts">
const { color = '--foreground-text1', icon, text, typographyClass = 'b2-regular' } = defineProps<{
  color?: string
  icon: string
  text: string
  typographyClass?: string
}>()
</script>

<template>
  <div class="icon-text--container">
    <VIcon :name="icon" />
    <span
      class="icon-text--text"
      :class="[typographyClass]"
    >{{ text }}</span>
  </div>
</template>

<style lang="scss" scoped>
.icon-text--container {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
}

.icon-text--text {
  color: v-bind('color')
}
</style>
