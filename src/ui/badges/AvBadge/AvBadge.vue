<script setup lang="ts">
import type { AvBadgeProps } from './AvBadge.types'

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
