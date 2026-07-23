<script setup lang="ts">
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface EnabledDisabledStatusBadgeProps {
  enabled: boolean
  feminineLabel?: boolean
}

const { enabled, feminineLabel = true } = defineProps<EnabledDisabledStatusBadgeProps>()
const { t } = useI18n()

const pluralCount = computed(() => feminineLabel ? 2 : 1)

const label = computed(() => enabled
  ? t('global.enabled', pluralCount.value)
  : t('global.disabled', pluralCount.value)
)
const icon = computed(() => enabled ? MDI_ICONS.CHECK_CIRCLE : MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
const color = computed(() => enabled ? 'var(--light-foreground-success)' : 'var(--light-foreground-error)')
const backgroundColor = computed(() => enabled ? 'var(--light-background-success)' : 'var(--light-background-error)')
</script>

<template>
  <AvBadge
    :label="label"
    :icon="icon"
    :color="color"
    :background-color="backgroundColor"
    data-testid="enabled-disabled-status-badge"
  />
</template>
