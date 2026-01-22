<script setup lang="ts">
import { useNavigation } from '@/common/composables'
import { AvButton, AvCancelConfirmButtons, AvIconText, AvPopover, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const {
  notificationsCount,
} = defineProps<{ notificationsCount: number }>()

const { navigateToStudentNotifications } = useNavigation()
const { t } = useI18n()
</script>

<template>
  <AvPopover padding="var(--spacing-md)">
    <template #trigger="{ toggle }">
      <AvButton
        :label="t('student.global.layout.header.quicklinks.notifications')"
        :icon="notificationsCount > 0 ? MDI_ICONS.BELL_NOTIFICATION : MDI_ICONS.NOTIFICATIONS_NONE"
        small
        @click="toggle"
      />
    </template>
    <template #popover="{ close }">
      <div class="av-col av-gap-md">
        <AvIconText
          data-testid="notifications-popover-title"
          :text="t('student.user.overlays.StudentNotificationsPopover.title', { count: notificationsCount })"
          :icon="MDI_ICONS.NOTIFICATIONS_NONE"
          text-color="var(--title)"
          icon-color="var(--dark-background-primary1)"
          typography-class="n6"
          gap="var(--spacing-md)"
        />
        <div v-if="notificationsCount === 0">
          <span class="b2-light">{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.header') }}</span>
          <ul class="b2-regular av-pl-lg">
            <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.teacherMessage') }}</span></li>
            <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.assessedSkill') }}</span></li>
            <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.validatedTrace') }}</span></li>
            <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.comingUpEvent') }}</span></li>
          </ul>
        </div>
        <div v-else>
          Notifications...
        </div>
        <div class="av-row av-justify-end av-gap-sm">
          <AvCancelConfirmButtons
            :cancel-label="t('global.buttons.exit')"
            :confirm-label="notificationsCount > 0 ? t('student.user.overlays.StudentNotificationsPopover.buttons.seeAll') : undefined"
            :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
            :confirm-icon="MDI_ICONS.ARROW_RIGHT_THIN"
            @cancel="close"
            @confirm="navigateToStudentNotifications"
          />
        </div>
      </div>
    </template>
  </AvPopover>
</template>
