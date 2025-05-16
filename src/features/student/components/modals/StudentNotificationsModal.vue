<script setup lang="ts">
import { useNavigation } from '@/common/composables/use-navigation'
import { AvButton, AvModal, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const {
  notificationCount,
  showModal,
  onClose,
} = defineProps<{ notificationCount: number, showModal: boolean, onClose: () => void }>()

const { navigateToStudentNotifications } = useNavigation()
const { t } = useI18n()

function navigateToNotifications () {
  navigateToStudentNotifications()
  onClose()
}
</script>

<template>
  <AvModal
    :title="t('feature.student.modals.notificationsModal.title', { count: notificationCount })"
    :icon="MDI_ICONS.NOTIFICATIONS_NONE"
    :opened="showModal"
    :close-button-label="t('feature.student.modals.notificationsModal.buttons.close')"
    :close-button-title="t('feature.student.modals.notificationsModal.buttons.close')"
    @close="onClose"
  >
    <div v-if="notificationCount === 0">
      <span class="b2-light">{{ t('feature.student.modals.notificationsModal.bodyNoNew.header') }}</span>
      <ul class="b2-regular">
        <li><span>{{ t('feature.student.modals.notificationsModal.bodyNoNew.teacherMessage') }}</span></li>
        <li><span>{{ t('feature.student.modals.notificationsModal.bodyNoNew.assessedSkill') }}</span></li>
        <li><span>{{ t('feature.student.modals.notificationsModal.bodyNoNew.validatedTrack') }}</span></li>
        <li><span>{{ t('feature.student.modals.notificationsModal.bodyNoNew.comingUpEvent') }}</span></li>
      </ul>
    </div>
    <div v-else>
      Notifications...
    </div>
    <template
      v-if="notificationCount > 0"
      #footer
    >
      <div class="notifications-modal__footer">
        <AvButton
          :label="t('feature.student.modals.notificationsModal.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT"
          :on-click="navigateToNotifications"
        />
      </div>
    </template>
  </AvModal>
</template>

<style lang="scss" scoped>
ul {
  padding-left: 2rem;
}

.notifications-modal__footer {
  display: flex;
  flex: 1;
  justify-content: right;
}
</style>
