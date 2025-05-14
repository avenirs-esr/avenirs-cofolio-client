<script setup lang="ts">
import { useNavigation } from '@/common/composables/use-navigation'
import { AvButton, AvModal, MDI_ICONS } from '@/ui'

const {
  messagesCount,
  showModal,
  onClose
} = defineProps<{ messagesCount: number, showModal: boolean, onClose: () => void }>()
const { navigateToStudentMessages } = useNavigation()

function navigateToMessages () {
  navigateToStudentMessages()
  onClose()
}
</script>

<template>
  <AvModal
    :title="messagesCount > 0 ? `${messagesCount} notifications non lues` : 'Aucun nouveau message'"
    :icon="MDI_ICONS.CHAT_BUBBLE"
    :opened="showModal"
    @close="onClose"
  >
    <div v-if="messagesCount === 0">
      <span class="b2-light">Vous n’avez aucun nouveau message à consulter.</span>
    </div>
    <div v-else>
      Messages...
    </div>
    <template #footer>
      <div class="messages-modal__footer">
        <AvButton
          v-if="messagesCount === 0"
          label="Aller à ma messagerie"
          variant="tertiary-no-outline"
          :icon="MDI_ICONS.ARROW_RIGHT"
          :on-click="navigateToMessages"
        />
        <AvButton
          v-else
          label="Voir tout"
          variant="tertiary-no-outline"
          :icon="MDI_ICONS.ARROW_RIGHT"
          :on-click="navigateToMessages"
        />
      </div>
    </template>
  </AvModal>
</template>

<style lang="scss" scoped>
:deep(.vicon) {
  color: var(--dark-background-primary1) !important;
}

.messages-modal__footer {
  display: flex;
  flex: 1;
  justify-content: right;
}
</style>
