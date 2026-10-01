<script lang="ts" setup>
import { AvFloatingPanel, type AvFloatingPanelProps } from '@avenirs-esr/avenirs-dsav'
import { type ComputedRef, type Slot, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface FloatingPanelProps extends Omit<AvFloatingPanelProps, 'collapseLabel' | 'expandLabel'> {}

const {
  defaultCollapsed = true,
  ...restProps
} = defineProps<FloatingPanelProps>()

const slots = defineSlots<{
  default?: Slot
}>()

const { t } = useI18n()
const attrs = useAttrs()

const avFloatingPanelProps: ComputedRef<AvFloatingPanelProps> = computed(() => ({
  ...attrs,
  ...restProps,
  defaultCollapsed,
  collapseLabel: t('global.buttons.collapse'),
  expandLabel: t('global.buttons.expand'),
  width: restProps.width ?? '35rem'
}))

const panelRef = ref<InstanceType<typeof AvFloatingPanel> | null>(null)

function togglePanel () {
  panelRef.value?.toggleCollapsed()
}

defineExpose({ togglePanel })
</script>

<template>
  <AvFloatingPanel
    ref="panelRef"
    v-bind="avFloatingPanelProps"
  >
    <template
      v-if="slots.default"
      #default
    >
      <slot />
    </template>
  </AvFloatingPanel>
</template>
