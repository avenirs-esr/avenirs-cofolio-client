<script setup lang="ts">
import { EAmsStatus } from '@/api/avenir-esr'
import { AvBadge } from '@/ui'
import { useI18n } from 'vue-i18n'

const { status } = defineProps<{ status: EAmsStatus }>()

const { t } = useI18n()
const basePath = import.meta.env.BASE_URL

function getStatusBadge (status: EAmsStatus) {
  switch (status) {
    case EAmsStatus.COMPLETED:
      return {
        labelkey: 'student.badges.studentAmsStatusBadge.status.completed',
        color: 'var(--light-foreground-neutral)',
        backgroundColor: 'var(--light-background-neutral)',
        iconPath: `${basePath}assets/icons/calendar-check-outline.svg`
      }
    case EAmsStatus.IN_PROGRESS:
      return {
        labelkey: 'student.badges.studentAmsStatusBadge.status.inProgress',
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: `${basePath}assets/icons/calendar-range-outline.svg`
      }
    case EAmsStatus.NOT_STARTED:
      return {
        labelkey: 'student.badges.studentAmsStatusBadge.status.notStarted',
        color: 'var(--text2)',
        backgroundColor: 'var(--other-background-base)',
        borderColor: 'var(--other-border-skill-card)',
        iconPath: `${basePath}assets/icons/calendar-clock-outline.svg`
      }
    case EAmsStatus.SUBMITTED:
      return {
        labelkey: 'student.badges.studentAmsStatusBadge.status.submitted',
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: `${basePath}assets/icons/dots-horizontal-circle-outline.svg`
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
