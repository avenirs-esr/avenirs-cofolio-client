<script setup lang="ts">
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ValorizedBadgeProps {
  valorized: boolean
}

const { valorized } = defineProps<ValorizedBadgeProps>()

const { t } = useI18n()

const avBadgeProps = computed(() => ({
  label: valorized ? t('global.valorized') : t('global.notValorized'),
  color: valorized
    ? 'var(--light-foreground-accent)'
    : 'var(--light-foreground-secondary)',
  backgroundColor: valorized
    ? 'var(--light-background-accent)'
    : 'var(--light-background-neutral)',
  icon: valorized ? MDI_ICONS.STAR : MDI_ICONS.STAR_OUTLINE,
})
)
</script>

<template>
  <AvBadge
    v-bind="avBadgeProps"
    border-color="transparent"
    ellipsis
    small
  />
</template>
