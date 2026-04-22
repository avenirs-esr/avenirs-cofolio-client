<script setup lang="ts">
import { EDeclaredSkillLevel, useGetAdditionalSkillConfig } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import { AvBadge, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredSkillLevelBadgeProps {
  level: EDeclaredSkillLevel
  small?: boolean
}

const { small = false, level } = defineProps<DeclaredSkillLevelBadgeProps>()

const { data: skillConfig } = useGetAdditionalSkillConfig()

function getBadgeConfig (level: string) {
  const config = {
    BEGINNER: {
      background: 'var(--light-background-primary3)',
      color: 'var(--dark-background-primary3)',
      icon: ICONS_DATA_URL.CLOCK_QUARTER_CHECK
    },
    INTERMEDIATE: {
      background: 'var(--light-background-info)',
      color: 'var(--dark-background-info)',
      icon: ICONS_DATA_URL.CLOCK_THIRD_CHECK
    },
    COMPETENT: {
      background: 'var(--light-background-critical)',
      color: 'var(--light-foreground-critical)',
      icon: ICONS_DATA_URL.CLOCK_HALF_PLUS_CHECK
    },
    ADVANCED: {
      background: 'var(--light-background-primary2)',
      color: 'var(--dark-background-primary2)',
      icon: ICONS_DATA_URL.CLOCK_ALMOST_CHECK
    },
    EXPERT: {
      background: 'var(--light-background-primary1)',
      color: 'var(--light-foreground-primary2)',
      icon: ICONS_DATA_URL.MDI_CHECK_CIRCLE
    }
  }
  return config[level as keyof typeof config] || config.BEGINNER
}

function getBadgeLabel (level: EDeclaredSkillLevel) {
  if (!skillConfig.value) {
    return level
  }
  return isEnumMember(EDeclaredSkillLevel, level) ? skillConfig.value[level]?.label ?? level : level
}

const badgeConfig = computed(() => getBadgeConfig(level))
const label = computed(() => getBadgeLabel(level))
</script>

<template>
  <AvBadge
    :label="label"
    :background-color="badgeConfig.background"
    :color="badgeConfig.color"
    :icon="badgeConfig.icon"
    :small="small"
  />
</template>
