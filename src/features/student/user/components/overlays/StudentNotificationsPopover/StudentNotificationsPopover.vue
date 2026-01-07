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
      <div class="container">
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
          <ul class="b2-regular">
            <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.teacherMessage') }}</span></li>
            <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.assessedSkill') }}</span></li>
            <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.validatedTrace') }}</span></li>
            <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.bodyNoNew.comingUpEvent') }}</span></li>
          </ul>
        </div>
        <div v-else>
          Notifications...
        </div>
        <div class="footer">
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

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

ul {
  padding-left: var(--spacing-lg);
}

.footer {
  display: flex;
  flex: 1;
  justify-content: right;
  gap: var(--spacing-sm);
}
</style>
