<script setup lang="ts">
import { useNavigation } from '@/common/composables/'
import { AvButton, AvModal, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const {
  messagesCount,
  showModal,
  onClose
} = defineProps<{ messagesCount: number, showModal: boolean, onClose: () => void }>()

const { navigateToStudentMailbox } = useNavigation()
const { t } = useI18n()

function navigateToMailbox () {
  navigateToStudentMailbox()
  onClose()
}
</script>

<template>
  <AvModal
    :title="t('student.modals.mailboxModal.title', { count: messagesCount })"
    :icon="MDI_ICONS.CHAT_BUBBLE"
    :opened="showModal"
    :close-button-label="t('student.modals.mailboxModal.buttons.close')"
    :close-button-title="t('student.modals.mailboxModal.buttons.close')"
    @close="onClose"
  >
    <div v-if="messagesCount === 0">
      <span class="b2-light">{{ t('student.modals.mailboxModal.bodyNoNew') }}</span>
    </div>
    <div v-else>
      Messages...
    </div>
    <template #footer>
      <div class="messages-modal__footer">
        <AvButton
          v-if="messagesCount === 0"
          :label="t('student.modals.mailboxModal.buttons.navigate')"
          :icon="MDI_ICONS.ARROW_RIGHT"
          :on-click="navigateToMailbox"
          size="sm"
        />
        <AvButton
          v-else
          :label="t('student.modals.mailboxModal.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT"
          :on-click="navigateToMailbox"
          size="sm"
        />
      </div>
    </template>
  </AvModal>
</template>

<style lang="scss" scoped>
.messages-modal__footer {
  display: flex;
  flex: 1;
  justify-content: right;
}
</style>
