<script setup lang="ts">
import { useNavigation } from '@/common/composables'
import { AvButton, AvModal, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const {
  notificationsCount,
  showModal,
  onClose,
} = defineProps<{ notificationsCount: number, showModal: boolean, onClose: () => void }>()

const { navigateToStudentNotifications } = useNavigation()
const { t } = useI18n()

function navigateToNotifications () {
  navigateToStudentNotifications()
  onClose()
}
</script>

<template>
  <AvModal
    :title="t('student.modals.notificationsModal.title', { count: notificationsCount })"
    :icon="MDI_ICONS.NOTIFICATIONS_NONE"
    :opened="showModal"
    :close-button-label="t('student.modals.notificationsModal.buttons.close')"
    :close-button-title="t('student.modals.notificationsModal.buttons.close')"
    @close="onClose"
  >
    <div v-if="notificationsCount === 0">
      <span class="b2-light">{{ t('student.modals.notificationsModal.bodyNoNew.header') }}</span>
      <ul class="b2-regular">
        <li><span>{{ t('student.modals.notificationsModal.bodyNoNew.teacherMessage') }}</span></li>
        <li><span>{{ t('student.modals.notificationsModal.bodyNoNew.assessedSkill') }}</span></li>
        <li><span>{{ t('student.modals.notificationsModal.bodyNoNew.validatedTrace') }}</span></li>
        <li><span>{{ t('student.modals.notificationsModal.bodyNoNew.comingUpEvent') }}</span></li>
      </ul>
    </div>
    <div v-else>
      Notifications...
    </div>
    <template
      v-if="notificationsCount > 0"
      #footer
    >
      <div class="notifications-modal__footer">
        <AvButton
          :label="t('student.modals.notificationsModal.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT"
          :on-click="navigateToNotifications"
          size="sm"
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
