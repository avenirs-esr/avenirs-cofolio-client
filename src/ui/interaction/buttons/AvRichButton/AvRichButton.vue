<script setup lang="ts">
import type { Slot } from 'vue'
import type { AvRichButtonProps } from './AvRichButton.types'

const {
  iconLeft = undefined,
  iconRight = undefined,
  borderColor = '--foreground-stroke',
  hoverBorderColor = '--dark-background-primary1',
  customPadding = '1rem',
  onClick
} = defineProps<AvRichButtonProps>()

defineSlots<{
  default?: Slot
}>()

const computedBorderColor = computed(() => `var(${borderColor})`)
const computedHoverBorderColor = computed(() => `var(${hoverBorderColor})`)

const theme = ref({
  borderColor: computedBorderColor,
  hoverBorderColor: computedHoverBorderColor,
  customPadding
})
</script>

<template>
  <button
    class="av-rich-button"
    @click="onClick"
  >
    <div class="av-rich-button__line">
      <div class="av-rich-button__left">
        <VIcon
          v-if="iconLeft"
          :name="iconLeft"
          scale="1.25"
          color="var(--dark-background-primary1)"
        />
        <slot />
      </div>
      <VIcon
        v-if="iconRight"
        :name="iconRight"
        scale="1.25"
        color="var(--dark-background-primary1)"
      />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.av-rich-button {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.75rem;
  border: 1px solid v-bind('theme.borderColor');
  overflow: hidden;
  padding: v-bind('theme.customPadding');
}

.av-rich-button:hover {
  border: 1px solid v-bind('theme.hoverBorderColor');
  box-shadow: 0 0 0 2px v-bind('theme.hoverBorderColor');
}

.av-rich-button__line {
  display: flex;
  width: 100%;
  align-items: center;
  text-align: left;
}

.av-rich-button__left {
  flex: 1;
  overflow: hidden;
}
</style>
