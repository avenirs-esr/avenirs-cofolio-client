<script setup lang="ts">
import { AvButton, AvPopover, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { username } = defineProps<{ username: string }>()

const { t } = useI18n()
</script>

<template>
  <AvPopover
    width="22rem"
    padding="var(--spacing-xs)"
  >
    <template #trigger="{ toggle }">
      <AvButton
        :label="username"
        :on-click="toggle"
        :icon="MDI_ICONS.ACCOUNT_CIRCLE"
      />
    </template>
    <template #popover>
      <ul>
        <li>
          <AvButton
            :label="t('student.overlays.profilePopover.buttons.manageProfile')"
            :icon="MDI_ICONS.PENCIL"
            variant="DEFAULT"
            theme="SECONDARY"
            size="sm"
            no-radius
          />
        </li>
        <li>
          <AvButton
            :label="t('student.overlays.profilePopover.buttons.seeCalendar')"
            :icon="MDI_ICONS.CALENDAR_MONTH"
            variant="DEFAULT"
            theme="SECONDARY"
            size="sm"
            no-radius
          />
        </li>
        <li>
          <AvButton
            :label="t('student.overlays.profilePopover.buttons.goToDw')"
            :icon="MDI_ICONS.ARROW_TOP_RIGHT"
            variant="DEFAULT"
            theme="SECONDARY"
            size="sm"
            no-radius
          />
        </li>
        <li>
          <AvButton
            :label="t('student.overlays.profilePopover.buttons.goToSkills')"
            :icon="MDI_ICONS.ARROW_TOP_RIGHT"
            variant="DEFAULT"
            theme="SECONDARY"
            size="sm"
            no-radius
          />
        </li>
        <li>
          <AvButton
            :label="t('student.overlays.profilePopover.buttons.logout')"
            :icon="MDI_ICONS.LOGOUT"
            variant="DEFAULT"
            theme="SECONDARY"
            size="sm"
            no-radius
          />
        </li>
      </ul>
    </template>
  </AvPopover>
</template>

<style lang="scss" scoped>
ul {
  list-style-type:none;
  padding: 0;
  margin: 0;
}

li > .av-button {
  width: 100% !important;
}
</style>
