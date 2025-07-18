<script setup lang="ts">
import { type SkillLevelOverviewDTO, SkillLevelStatus, type SkillLevelViewDTO } from '@/api/avenir-esr'
import { AvBadge } from '@/ui'
import { useI18n } from 'vue-i18n'

const { level } = defineProps<{ level: SkillLevelOverviewDTO | SkillLevelViewDTO }>()

const { t } = useI18n()

function levelToBadge (status: SkillLevelStatus) {
  const basePath = import.meta.env.BASE_URL

  switch (status) {
    // TODO: return correct values for UNDER_ACQUISITION status when starting #312
    case SkillLevelStatus.NOT_STARTED:
    case SkillLevelStatus.UNDER_ACQUISITION:
    case SkillLevelStatus.TO_BE_EVALUATED:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.inProgress',
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: `${basePath}assets/icons/hourglass.svg`
      }
    case SkillLevelStatus.UNDER_REVIEW:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.underReview',
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: `${basePath}assets/icons/dots-horizontal-circle-outline.svg`
      }
    case SkillLevelStatus.VALIDATED:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.validated',
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconPath: `${basePath}assets/icons/check-circle.svg`
      }
    case SkillLevelStatus.FAILED:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.failed',
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconPath: `${basePath}assets/icons/close-circle-outline.svg`
      }
  }
}

const levelBadge = computed(() => levelToBadge(level.status))
const label = computed(() => t(levelBadge.value.labelkey))
</script>

<template>
  <AvBadge
    v-bind="levelBadge"
    :label="label"
    small
    ellipsis
  />
</template>

<style lang="scss" scoped></style>
