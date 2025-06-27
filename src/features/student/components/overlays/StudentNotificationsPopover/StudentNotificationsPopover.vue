<script setup lang="ts">
import { useNavigation } from '@/common/composables'
import { AvButton, AvIconText, AvPopover, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const {
  notificationsCount,
} = defineProps<{ notificationsCount: number }>()

const { navigateToStudentNotifications } = useNavigation()
const { t } = useI18n()
</script>

<template>
  <AvPopover
    width="30rem"
    padding="var(--spacing-md)"
  >
    <template #trigger="{ toggle }">
      <AvButton
        :label="t('student.layout.header.quicklinks.notifications')"
        :on-click="toggle"
        :icon="notificationsCount > 0 ? MDI_ICONS.BELL_NOTIFICATION : MDI_ICONS.NOTIFICATIONS_NONE"
      />
    </template>
    <template #popover="{ close }">
      <div class="container">
        <AvIconText
          data-testid="notifications-popover-title"
          :text="t('student.overlays.notificationsPopover.title', { count: notificationsCount })"
          :icon="MDI_ICONS.NOTIFICATIONS_NONE"
          text-color="var(--title)"
          icon-color="var(--dark-background-primary1)"
          typography-class="n6"
          gap="var(--spacing-md)"
        />
        <div v-if="notificationsCount === 0">
          <span class="b2-light">{{ t('student.overlays.notificationsPopover.bodyNoNew.header') }}</span>
          <ul class="b2-regular">
            <li><span>{{ t('student.overlays.notificationsPopover.bodyNoNew.teacherMessage') }}</span></li>
            <li><span>{{ t('student.overlays.notificationsPopover.bodyNoNew.assessedSkill') }}</span></li>
            <li><span>{{ t('student.overlays.notificationsPopover.bodyNoNew.validatedTrace') }}</span></li>
            <li><span>{{ t('student.overlays.notificationsPopover.bodyNoNew.comingUpEvent') }}</span></li>
          </ul>
        </div>
        <div v-else>
          Notifications...
        </div>
        <div class="footer">
          <AvButton
            :label="t('global.buttons.exit')"
            :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
            :on-click="close"
            size="sm"
          />
          <AvButton
            v-if="notificationsCount > 0"
            data-testid="notifications-popover-navigate"
            :label="t('student.overlays.notificationsPopover.buttons.seeAll')"
            :icon="MDI_ICONS.ARROW_RIGHT_THIN"
            :on-click="navigateToStudentNotifications"
            size="sm"
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
  padding-left: 2rem;
}

.footer {
  display: flex;
  flex: 1;
  justify-content: right;
  gap: var(--spacing-sm);
}
</style>
