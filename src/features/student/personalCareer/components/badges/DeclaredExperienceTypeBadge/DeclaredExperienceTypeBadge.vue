<script setup lang="ts">
import type { EExperienceType } from '@/api/avenir-esr'
import { AvBadge, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeclaredExperienceTypeBadgeProps {
  experienceType: EExperienceType
}

const { experienceType } = defineProps<DeclaredExperienceTypeBadgeProps>()

const { t } = useI18n()

const experienceTypeColorMap: Record<EExperienceType, string> = {
  PROFESSIONAL: 'var(--dark-background-primary3)',
  PERSONAL: 'var(--dark-background-success)'
}
</script>

<template>
  <AvBadge
    :label="t(`student.personalCareer.declaredExperienceType.${experienceType}`)"
    :background-color="experienceTypeColorMap[experienceType]"
    :icon="RI_ICONS.HONOUR_LINE"
    color="var(--card2)"
    data-testid="declared-experience-type-badge"
    ellipsis
  />
</template>
