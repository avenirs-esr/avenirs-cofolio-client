<script setup lang="ts">
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <AvBadge
    :label="t('global.valorized')"
    :icon="MDI_ICONS.STAR"
    color="var(--light-foreground-accent)"
    background-color="var(--light-background-accent)"
    border-color="transparent"
    ellipsis
    small
  />
</template>
