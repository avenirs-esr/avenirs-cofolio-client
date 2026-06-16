<script setup lang="ts">
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { AvBadge, MDI_ICONS, PH_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeclaredActivityStatusBadgeProps {
  status: EDeclaredActivityStatus
}

const { status } = defineProps<DeclaredActivityStatusBadgeProps>()

const { t } = useI18n()

const avBadgeProps = computed(() => {
  switch (status) {
    case EDeclaredActivityStatus.COMPLETED:
      return {
        label: t('global.activities.badges.declaredStatuses.COMPLETED'),
        icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE,
        color: 'var(--text1)',
        backgroundColor: 'var(--light-background-neutral)'
      }

    case EDeclaredActivityStatus.IN_PROGRESS:
      return {
        label: t('global.activities.badges.declaredStatuses.IN_PROGRESS'),
        icon: MDI_ICONS.HOURGLASS,
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)'
      }

    case EDeclaredActivityStatus.SUBMITTED:
      return {
        label: t('global.activities.badges.declaredStatuses.SUBMITTED'),
        icon: MDI_ICONS.DOTS_HORIZONTAL_CIRCLE_OUTLINE,
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
      }

    case EDeclaredActivityStatus.SUBSCRIBED:
    default:
      return {
        label: t('global.activities.badges.declaredStatuses.SUBSCRIBED'),
        icon: PH_ICONS.NOTE_PENCIL,
        color: 'var(--card)',
        backgroundColor: 'var(--dark-background-primary3)',
      }
  }
})
</script>

<template>
  <AvBadge
    v-bind="avBadgeProps"
    :data-status="status"
    small
    data-testid="declared-activity-status-badge"
  />
</template>
