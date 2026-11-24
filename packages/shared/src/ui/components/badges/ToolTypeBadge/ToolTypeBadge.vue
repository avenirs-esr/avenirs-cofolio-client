<script lang="ts" setup>
import type { AvBadgeProps } from '@avenirs-esr/avenirs-dsav'
import { EToolType } from '#shared/api/avenir-esr/index'
import { ICONS } from '#shared/constants/icons'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ToolTypeBadgeProps {
  type: EToolType
}

const { type } = defineProps<ToolTypeBadgeProps>()

const { t } = useI18n()

const avBadgeProps = computed<AvBadgeProps>(() => {
  let color: string
  let backgroundColor: string
  let icon: string

  switch (type) {
    case EToolType.NATIONAL:
      color = 'var(--light-foreground-primary1)'
      backgroundColor = 'var(--light-background-primary1)'
      icon = ICONS.NATIONAL
      break
    case EToolType.REGIONAL:
      color = 'var(--light-foreground-primary2)'
      backgroundColor = 'var(--light-background-primary2)'
      icon = ICONS.REGIONAL
      break
    case EToolType.LOCAL:
    default:
      color = 'var(--light-foreground-primary3)'
      backgroundColor = 'var(--light-background-primary3)'
      icon = ICONS.LOCAL
  }

  return {
    label: t(`global.components.badges.ToolTypeBadge.${type}`),
    color,
    backgroundColor,
    icon,
  }
})
</script>

<template>
  <AvBadge v-bind="avBadgeProps" />
</template>
