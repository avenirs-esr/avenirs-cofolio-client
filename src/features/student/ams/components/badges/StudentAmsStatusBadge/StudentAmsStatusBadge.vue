<script setup lang="ts">
import { EAmsStatus } from '@/api/avenir-esr'
import { AvBadge, type AvBadgeProps, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { status } = defineProps<{ status: EAmsStatus }>()

const { t } = useI18n()

function getStatusBadge (status: EAmsStatus): AvBadgeProps {
  switch (status) {
    case EAmsStatus.COMPLETED:
      return {
        label: t('student.badges.studentAmsStatusBadge.status.completed'),
        color: 'var(--light-foreground-neutral)',
        backgroundColor: 'var(--light-background-neutral)',
        icon: ICONS_DATA_URL.MDI_CALENDAR_CHECK_OUTLINE
      }
    case EAmsStatus.IN_PROGRESS:
      return {
        label: t('student.badges.studentAmsStatusBadge.status.inProgress'),
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        icon: ICONS_DATA_URL.MDI_CALENDAR_RANGE_OUTLINE
      }
    case EAmsStatus.NOT_STARTED:
      return {
        label: t('student.badges.studentAmsStatusBadge.status.notStarted'),
        color: 'var(--text2)',
        backgroundColor: 'var(--other-background-base)',
        borderColor: 'var(--other-border-skill-card)',
        icon: ICONS_DATA_URL.MDI_CALENDAR_CLOCK_OUTLINE
      }
    case EAmsStatus.SUBMITTED:
      return {
        label: t('student.badges.studentAmsStatusBadge.status.submitted'),
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        icon: ICONS_DATA_URL.MDI_DOTS_HORIZONTAL_CIRCLE_OUTLINE
      }
  }
}

const statusBadge = computed(() => getStatusBadge(status))
</script>

<template>
  <AvBadge
    v-bind="statusBadge"
    small
    ellipsis
  />
</template>

<style lang="scss" scoped></style>
