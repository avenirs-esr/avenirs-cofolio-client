<script setup lang="ts">
import { AmsStatus } from '@/types'
import { AvBadge } from '@/ui'
import { useI18n } from 'vue-i18n'

const { status } = defineProps<{ status: AmsStatus }>()

const { t } = useI18n()

function getStatusBadge (status: AmsStatus) {
  switch (status) {
    case AmsStatus.COMPLETED:
      return {
        labelkey: 'student.badges.studentAmsStatusBadge.status.completed',
        color: 'var(--light-foreground-neutral)',
        backgroundColor: 'var(--light-background-neutral)',
        iconPath: '/assets/icons/calendar-check-outline.svg'
      }
    case AmsStatus.IN_PROGRESS:
      return {
        labelkey: 'student.badges.studentAmsStatusBadge.status.inProgress',
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: '/assets/icons/calendar-range-outline.svg'
      }
    case AmsStatus.NOT_STARTED:
      return {
        labelkey: 'student.badges.studentAmsStatusBadge.status.notStarted',
        color: 'var(--foreground-text2)',
        backgroundColor: 'var(--white)',
        borderColor: 'var(--other-border-skill-card)',
        iconPath: '/assets/icons/calendar-clock-outline.svg'
      }
    case AmsStatus.SUBMITTED:
      return {
        labelkey: 'student.badges.studentAmsStatusBadge.status.submitted',
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: '/assets/icons/dots-horizontal-circle-outline.svg'
      }
  }
}

const statusBadge = computed(() => getStatusBadge(status))
</script>

<template>
  <AvBadge
    v-bind="statusBadge"
    :label="t(statusBadge.labelkey)"
    small
    ellipsis
  />
</template>

<style lang="scss" scoped></style>
