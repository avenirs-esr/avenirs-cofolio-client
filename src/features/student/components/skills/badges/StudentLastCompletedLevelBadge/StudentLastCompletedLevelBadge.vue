<script setup lang="ts">
import { ESkillLevelStatus, type SkillLevelProgressOverviewDTO, type SkillLevelViewDTO } from '@/api/avenir-esr'
import { AvBadge, type AvBadgeProps, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { level } = defineProps<{ level: SkillLevelProgressOverviewDTO | SkillLevelViewDTO }>()

const { t } = useI18n()

const levelToBadgeProps = computed<AvBadgeProps | undefined>(() => {
  const status = level.status

  switch (status) {
    case ESkillLevelStatus.VALIDATED:
      return {
        label: `${level.name} ${t('student.badges.studentLevelBadge.status.validated')}`,
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconDataUrl: ICONS_DATA_URL.MDI_CHECK_CIRCLE
      }
    case ESkillLevelStatus.FAILED:
      return {
        label: `${level.name} ${t('student.badges.studentLevelBadge.status.failed')}`,
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconDataUrl: ICONS_DATA_URL.MDI_CLOSE_CIRCLE_OUTLINE
      }
  }
  return undefined
})
</script>

<template>
  <AvBadge
    v-if="levelToBadgeProps"
    v-bind="levelToBadgeProps"
    small
    ellipsis
  />
</template>

<style lang="scss" scoped></style>
