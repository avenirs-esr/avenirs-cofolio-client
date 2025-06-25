<script setup lang="ts">
import type { Slot } from 'vue'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'

export interface AvRichButtonProps {
  iconLeft?: string
  iconRight?: string
  borderColor?: string
  customPadding?: string
  hoverBorderColor?: string
  onClick?: (event: MouseEvent) => void
}

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
        <AvVIcon
          v-if="iconLeft"
          :name="iconLeft"
          color="var(--dark-background-primary1)"
          :size="1.5"
        />
        <slot />
      </div>
      <AvVIcon
        v-if="iconRight"
        :name="iconRight"
        color="var(--dark-background-primary1)"
        :size="1.5"
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
