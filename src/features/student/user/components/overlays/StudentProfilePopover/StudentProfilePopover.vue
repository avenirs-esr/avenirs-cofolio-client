<script setup lang="ts">
import UserProfilePopover from '@/common/components/overlay/UserProfilePopover/UserProfilePopover.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<{ username: string }>()

const { t } = useI18n()
const isDemo = __DEMO_MODE__

const actions = computed(() => [
  {
    label: t('student.user.overlays.StudentProfilePopover.buttons.manageProfile'),
    icon: MDI_ICONS.PENCIL_OUTLINE,
    hidden: isDemo,
  },
  {
    label: t('student.user.overlays.StudentProfilePopover.buttons.seeCalendar'),
    icon: MDI_ICONS.CALENDAR_MONTH_OUTLINE,
    hidden: isDemo,
  },
  {
    label: t('student.user.overlays.StudentProfilePopover.buttons.goToDw'),
    icon: MDI_ICONS.ARROW_TOP_RIGHT_THICK,
    hidden: isDemo,
  },
  {
    label: t('student.user.overlays.StudentProfilePopover.buttons.goToSkills'),
    icon: MDI_ICONS.ARROW_TOP_RIGHT_THICK,
    hidden: isDemo,
  },
])
</script>

<template>
  <UserProfilePopover
    :username="username"
    :actions="actions"
  />
</template>
