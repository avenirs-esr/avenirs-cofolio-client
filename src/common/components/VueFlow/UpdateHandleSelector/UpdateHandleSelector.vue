<script setup lang="ts">
import Toggle from '@/common/components/Toggle/Toggle.vue'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { Position } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

/**
 * Props for the UpdateHandleSelector component.
 */
export interface UpdateHandleSelectorProps {
  /**
   * Indicates whether the handle is enabled or not.
   */
  modelValue?: boolean

  /**
   * The position of the handle.
   */
  position: Position
}

const { position, modelValue } = defineProps<UpdateHandleSelectorProps>()

/**
 * Emits events related to updating the handle selector.
 * @emits update:model-value - When the model value (enabled/disabled) of the handle changes.
 */
defineEmits<{
  /**
   * Emitted when the model value (enabled/disabled) of the handle changes.
   * @param value - The new model value.
   */
  (e: 'update:model-value', value: boolean): void
}>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const id = computed(() => `update-handle-selector-${position}`)
const description = computed(() => t(`global.vueFlow.UpdateHandleSelector.position.${position}`))
const inline = computed(() => position === Position.Top || position === Position.Bottom)
</script>

<template>
  <div
    :class="{ 'av-row av-row--center': inline,
              'is-mobile': isMobile,
    }"
  >
    <Toggle
      :id="id"
      :name="id"
      :model-value="modelValue"
      :description="description"
      @update:model-value="$emit('update:model-value', $event as boolean)"
    />
  </div>
</template>

<style lang="scss" scoped>
.is-mobile {
  :deep(.av-toggle, .toggle) {
    flex-direction: column;
    align-items: center;
  }
}
</style>
