<script setup lang="ts">
import type { EProgramStatus } from '@/api/avenir-esr'
import { AvBadge, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeclaredProgramStatusBadgeProps {
  status: EProgramStatus
}

const { status } = defineProps<DeclaredProgramStatusBadgeProps>()

const { t } = useI18n()

const statusColorMap: Record<EProgramStatus, string> = {
  NOT_STARTED: 'var(--light-background-neutral)',
  IN_PROGRESS: 'var(--light-background-primary2)',
  COMPLETED: 'var(--light-background-neutral)'
}

const statusIconMap: Record<EProgramStatus, string> = {
  NOT_STARTED: ICONS_DATA_URL.MDI_HOURGLASS,
  IN_PROGRESS: ICONS_DATA_URL.MDI_HOURGLASS,
  COMPLETED: MDI_ICONS.CHECK_CIRCLE
}

const statusTextColorMap: Record<EProgramStatus, string> = {
  NOT_STARTED: 'var(--text1)',
  IN_PROGRESS: 'var(--light-foreground-primary1)',
  COMPLETED: 'var(--text1)'
}

const statusBadgeProps = computed(() => ({
  label: t(`student.personalCareer.declaredProgramStatus.${status}`),
  backgroundColor: statusColorMap[status],
  icon: statusIconMap[status],
  color: statusTextColorMap[status],
}))
</script>

<template>
  <AvBadge
    v-bind="statusBadgeProps"
    data-testid="declared-program-status-badge"
  />
</template>
