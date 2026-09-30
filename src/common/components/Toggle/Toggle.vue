<script setup lang="ts">
import { AvToggle, type AvToggleProps } from '@avenirs-esr/avenirs-dsav'
import { type Slot, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ToggleProps extends AvToggleProps {
  activeText?: string
  inactiveText?: string
}

const {
  activeText,
  inactiveText,
  ...restProps
} = defineProps<ToggleProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

defineSlots<{
  default?: Slot<{ active: boolean }>
}>()

const { t } = useI18n()
const attrs = useAttrs()

const avToggleProps = computed<AvToggleProps>(() => ({
  ...attrs,
  ...restProps,
}))
</script>

<template>
  <AvToggle
    v-bind="avToggleProps"
    data-testid="toggle"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #default="{ active }">
      <slot :active>
        <div class="toggle-text av-row">
          <span
            v-if="active"
            class="caption-bold no-select"
            data-testid="toggle-active"
          >
            {{ activeText ?? t('global.AvToggle.activeText') }}
          </span>

          <span
            v-else
            class="caption-regular no-select"
            data-testid="toggle-inactive"
          >
            {{ inactiveText ?? t('global.AvToggle.inactiveText') }}
          </span>
        </div>
      </slot>
    </template>
  </AvToggle>
</template>
