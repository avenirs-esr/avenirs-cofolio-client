<script setup lang="ts">
import { ESkillLevelStatus, type SkillLevelProgressOverviewDTO, type SkillLevelViewDTO } from '@/api/avenir-esr'
import { AvBadge } from '@/ui'
import { useI18n } from 'vue-i18n'

const { level } = defineProps<{ level: SkillLevelProgressOverviewDTO | SkillLevelViewDTO }>()

const { t } = useI18n()
const basePath = import.meta.env.BASE_URL

const levelToBadgeProps = computed(() => {
  const status = level.status

  switch (status) {
    case ESkillLevelStatus.VALIDATED:
      return {
        label: `${level.name} ${t('student.badges.studentLevelBadge.status.validated')}`,
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconPath: `${basePath}assets/icons/check-circle.svg`
      }
    case ESkillLevelStatus.FAILED:
      return {
        label: `${level.name} ${t('student.badges.studentLevelBadge.status.failed')}`,
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconPath: `${basePath}assets/icons/close-circle-outline.svg`
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
