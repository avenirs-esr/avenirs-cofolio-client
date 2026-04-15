<script setup lang="ts">
import { AvButton, type AvButtonProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteOverlayProps {
  buttonLabel?: string
  buttonTheme?: AvButtonProps['theme']
}

const { buttonLabel } = defineProps<DeleteOverlayProps>()

defineEmits<{
  (e: 'delete'): void
}>()

const { t } = useI18n()

const resolvedButtonLabel = computed(() => buttonLabel ?? t('global.buttons.delete'))
</script>

<template>
  <div class="delete-overlay av-w-full">
    <slot />

    <div class="delete-overlay__action">
      <AvButton
        :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        :label="resolvedButtonLabel"
        :theme="buttonTheme"
        icon-only
        @click="$emit('delete')"
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
  top: 0.25rem;
  right: 0.25rem;
  z-index: 2;
}
</style>
