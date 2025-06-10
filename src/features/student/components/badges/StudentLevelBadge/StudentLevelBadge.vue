<script setup lang="ts">
import { type LevelDTO, type LevelDTO_Temp, LevelStatus } from '@/types'
import { AvBadge } from '@/ui'
import { useI18n } from 'vue-i18n'

const { level } = defineProps<{ level: LevelDTO | LevelDTO_Temp }>()

const { t } = useI18n()

function levelToBadge (level: LevelDTO | LevelDTO_Temp) {
  switch (level.status) {
    case LevelStatus.NOT_VALIDATED:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.notValidated',
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconPath: '/assets/icons/close-circle-outline.svg'
      }
    case LevelStatus.TO_EVALUATE:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.inProgress',
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: '/assets/icons/hourglass.svg'
      }
    case LevelStatus.UNDER_REVIEW:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.underReview',
        color: 'var(--dark-background-critical)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: '/assets/icons/dots-horizontal-circle-outline.svg'
      }
    case LevelStatus.VALIDATED:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.validated',
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconPath: '/assets/icons/check-circle.svg'
      }
  }
}

const levelBadge = computed(() => levelToBadge(level))
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
