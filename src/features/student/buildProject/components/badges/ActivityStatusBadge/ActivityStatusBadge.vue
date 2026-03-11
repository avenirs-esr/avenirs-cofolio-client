<script setup lang="ts">
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { AvBadge, MDI_ICONS, PH_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  status: EDeclaredActivityStatus
}>()

const { t } = useI18n()

const statusConfig = computed(() => {
  switch (props.status) {
    case EDeclaredActivityStatus.IN_PROGRESS:
      return {
        label: t('student.buildProject.activities.declaredActivityStatus.IN_PROGRESS'),
        icon: MDI_ICONS.HOURGLASS,
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)'
      }

    case EDeclaredActivityStatus.SUBSCRIBED:
      return {
        label: t('student.buildProject.activities.declaredActivityStatus.SUBSCRIBED'),
        icon: PH_ICONS.NOTE_PENCIL,
        color: 'var(--card)',
        backgroundColor: 'var(--dark-background-primary3)',
      }

    case EDeclaredActivityStatus.COMPLETED:
      return {
        label: t('student.buildProject.activities.declaredActivityStatus.COMPLETED'),
        icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE,
        color: 'var(--text1)',
        backgroundColor: 'var(--light-background-neutral)'
      }

    default:
      return null
  }
})
</script>

<template>
  <AvBadge
    v-if="statusConfig"
    data-testid="activity-status-badge"
    :data-status="status"
    :label="statusConfig.label"
    :icon="statusConfig.icon"
    :color="statusConfig.color"
    :background-color="statusConfig.backgroundColor"
    small
  />
</template>
