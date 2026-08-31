<script lang="ts" setup>
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface UpdateInProgressBadgeProps {
  show: boolean
}

defineProps<UpdateInProgressBadgeProps>()

const { t } = useI18n()
</script>

<template>
  <div
    v-if="show"
    class="av-row av-justify-end"
    data-testid="update-in-progress-badge"
  >
    <AvBadge
      :label="t('student.global.badges.UpdateInProgress')"
      background-color="var(--dark-background-primary1)"
      color="var(--dark-foreground)"
      :icon="MDI_ICONS.PENCIL_OUTLINE"
    />
  </div>
</template>
