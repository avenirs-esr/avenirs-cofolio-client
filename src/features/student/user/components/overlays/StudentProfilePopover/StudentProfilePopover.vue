<script setup lang="ts">
import { AvButton, AvPopover, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { username } = defineProps<{ username: string }>()

const { t } = useI18n()
</script>

<template>
  <AvPopover padding="var(--spacing-xs)">
    <template #trigger="{ toggle }">
      <AvButton
        :label="username"
        :icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
        small
        no-sentence-case
        @click="toggle"
      />
    </template>
    <template #popover>
      <ul>
        <li>
          <AvButton
            :label="t('student.user.overlays.StudentProfilePopover.buttons.manageProfile')"
            :icon="MDI_ICONS.PENCIL_OUTLINE"
            variant="DEFAULT"
            theme="SECONDARY"
            small
            no-radius
          />
        </li>
        <li>
          <AvButton
            :label="t('student.user.overlays.StudentProfilePopover.buttons.seeCalendar')"
            :icon="MDI_ICONS.CALENDAR_MONTH_OUTLINE"
            variant="DEFAULT"
            theme="SECONDARY"
            small
            no-radius
          />
        </li>
        <li>
          <AvButton
            :label="t('student.user.overlays.StudentProfilePopover.buttons.goToDw')"
            :icon="MDI_ICONS.ARROW_TOP_RIGHT_THICK"
            variant="DEFAULT"
            theme="SECONDARY"
            small
            no-radius
          />
        </li>
        <li>
          <AvButton
            :label="t('student.user.overlays.StudentProfilePopover.buttons.goToSkills')"
            :icon="MDI_ICONS.ARROW_TOP_RIGHT_THICK"
            variant="DEFAULT"
            theme="SECONDARY"
            small
            no-radius
          />
        </li>
        <li>
          <AvButton
            :label="t('student.user.overlays.StudentProfilePopover.buttons.logout')"
            :icon="MDI_ICONS.LOGOUT"
            variant="DEFAULT"
            theme="SECONDARY"
            small
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
