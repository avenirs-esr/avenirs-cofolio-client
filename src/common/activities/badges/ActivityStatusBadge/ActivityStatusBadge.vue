<script lang="ts" setup>
import { EActivityStatus } from '@/api/avenir-esr'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityStatusBadgeProps {
  status: EActivityStatus
}

const { status } = defineProps<ActivityStatusBadgeProps>()

const { t } = useI18n()

const label = computed(() => t(`global.activities.badges.statuses.${status}`))

const badgeColors = computed(() => {
  switch (status) {
    case EActivityStatus.UNPUBLISHED:
      return {
        color: 'var(--dark-background-warn)',
        backgroundColor: 'var(--light-background-warn)',
      }

    case EActivityStatus.PUBLISHED:
      return {
        color: 'var(--dark-background-success)',
        backgroundColor: 'var(--light-background-success)',
      }

    case EActivityStatus.DRAFT:
    default:
      return {
        color: 'var(--text1)',
        backgroundColor: 'var(--surface-background)',
      }
  }
})

const icon = computed(() => {
  switch (status) {
    case EActivityStatus.DRAFT:
      return MDI_ICONS.TEXT_BOX_EDIT_OUTLINE
    case EActivityStatus.UNPUBLISHED:
    case EActivityStatus.PUBLISHED:
    default:
      return MDI_ICONS.TEXT_BOX_CHECK_OUTLINE
  }
})
</script>

<template>
  <AvBadge
    :label="label"
    :icon="icon"
    :color="badgeColors.color"
    :background-color="badgeColors.backgroundColor"
    border-color="var(--stroke)"
  />
</template>
