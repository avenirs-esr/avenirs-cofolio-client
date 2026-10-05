<script setup lang="ts">
import { AvButton, type AvButtonProps, type AvInteractiveProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteOverlayProps extends AvInteractiveProps {
  buttonLabel?: string
  buttonTheme?: AvButtonProps['theme']
}

const { buttonLabel, disabled = false, disabledTooltip } = defineProps<DeleteOverlayProps>()

defineEmits<{
  (e: 'delete'): void
}>()

const { t } = useI18n()

const resolvedButtonLabel = computed(() => buttonLabel ?? t('global.buttons.delete'))
</script>

<template>
  <div class="delete-overlay">
    <slot />

    <div class="delete-overlay__action av-top-xxs av-right-xxs">
      <AvButton
        :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        :label="resolvedButtonLabel"
        :theme="buttonTheme"
        :disabled="disabled"
        :disabled-tooltip="disabledTooltip"
        icon-only
        size="LG"
        @click.stop="$emit('delete')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.delete-overlay {
  position: relative;
}

.delete-overlay__action {
  position: absolute;
  z-index: 2;
}
</style>
