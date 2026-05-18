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

const icon = computed(() => {
  switch (status) {
    case EActivityStatus.DRAFT:
      return MDI_ICONS.TEXT_BOX_EDIT_OUTLINE
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
    color="var(--text1)"
    background-color="var(--surface-background)"
    border-color="var(--stroke)"
  />
</template>
