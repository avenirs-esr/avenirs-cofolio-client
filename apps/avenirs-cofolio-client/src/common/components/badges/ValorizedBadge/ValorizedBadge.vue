<script setup lang="ts">
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ValorizedBadgeProps {
  valorized: boolean | undefined
}

const { valorized } = defineProps<ValorizedBadgeProps>()

const isValorized = computed(() => valorized === true)

const { t } = useI18n()

const avBadgeProps = computed(() => ({
  label: isValorized.value ? t('global.valorized') : t('global.notValorized'),
  color: isValorized.value
    ? 'var(--light-foreground-accent)'
    : 'var(--light-foreground-secondary)',
  backgroundColor: isValorized.value
    ? 'var(--light-background-accent)'
    : 'var(--light-background-neutral)',
  icon: isValorized.value ? MDI_ICONS.STAR : MDI_ICONS.STAR_OUTLINE,
})
)
</script>

<template>
  <AvBadge
    data-testid="valorized-badge"
    :data-valorized="isValorized"
    v-bind="avBadgeProps"
    border-color="transparent"
    ellipsis
    small
  />
</template>
