<script setup lang="ts">
import { ESkillLevelStatus } from '@/api/avenir-esr'
import { AvBadge, type AvBadgeProps, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { status } = defineProps<{ status: ESkillLevelStatus }>()

const { t } = useI18n()

function statusToBadge (status: ESkillLevelStatus): AvBadgeProps {
  switch (status) {
    case ESkillLevelStatus.NOT_STARTED:
    case ESkillLevelStatus.UNDER_ACQUISITION:
    case ESkillLevelStatus.TO_BE_EVALUATED:
      return {
        label: t('student.badges.studentLevelBadge.status.inProgress'),
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconDataUrl: ICONS_DATA_URL.MDI_HOURGLASS
      }
    case ESkillLevelStatus.UNDER_REVIEW:
      return {
        label: t('student.badges.studentLevelBadge.status.underReview'),
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        iconDataUrl: ICONS_DATA_URL.MDI_DOTS_HORIZONTAL_CIRCLE_OUTLINE
      }
    case ESkillLevelStatus.VALIDATED:
      return {
        label: t('student.badges.studentLevelBadge.status.validated'),
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconDataUrl: ICONS_DATA_URL.MDI_CHECK_CIRCLE
      }
    case ESkillLevelStatus.FAILED:
      return {
        label: t('student.badges.studentLevelBadge.status.failed'),
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconDataUrl: ICONS_DATA_URL.MDI_CLOSE_CIRCLE_OUTLINE
      }
  }
}

const levelBadge = computed(() => statusToBadge(status))
</script>

<template>
  <AvBadge
    v-bind="levelBadge"
    small
    ellipsis
  />
</template>

<style lang="scss" scoped></style>
