<script lang="ts" setup>
import type { AvBadgeProps } from '@avenirs-esr/avenirs-dsav'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ActiveBadgeProps {
  active?: boolean
  labelGender?: 'FEMININE' | 'MASCULINE' | 'NEUTRAL'
}

const { active = false, labelGender = 'NEUTRAL' } = defineProps<ActiveBadgeProps>()

const { t } = useI18n()

const avBadgeProps = computed<AvBadgeProps>(() => ({
  color: active ? 'var(--light-foreground-success)' : 'var(--light-foreground-error)',
  backgroundColor: active ? 'var(--light-background-success)' : 'var(--light-background-error)',
  label: t(`global.components.badges.ActiveBadge.${active ? 'active' : 'inactive'}.${labelGender}`),
  icon: active ? MDI_ICONS.CHECK_CIRCLE_OUTLINE : MDI_ICONS.CLOSE_CIRCLE_OUTLINE
}))
</script>

<template>
  <AvBadge v-bind="avBadgeProps" />
</template>
