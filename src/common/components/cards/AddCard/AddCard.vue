<script setup lang="ts">
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AddCardProps {
  label?: string
}

const { label } = defineProps<AddCardProps>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const { t } = useI18n()

const displayedLabel = computed(() => label ?? t('global.buttons.add'))
</script>

<template>
  <button
    class="add-card av-col av-align-center av-justify-center av-gap-xs av-p-md av-border-width-sm av-border-style-solid av-radius-xl"
    type="button"
    data-testid="add-card"
    @click="emit('click')"
  >
    <AvIcon
      :name="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
      :size="2"
    />
    <span class="b1-regular">{{ displayedLabel }}</span>
  </button>
</template>

<style scoped lang="scss">
.add-card {
  border-color: var(--light-background-neutral);
  min-height: 12.5rem;
  min-width: 13.5rem;
  cursor: pointer;
}
</style>
