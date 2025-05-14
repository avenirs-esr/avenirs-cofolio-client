<script setup lang="ts">
import { useNavigation } from '@/common/composables/use-navigation'
import { AvButton, AvModal, MDI_ICONS } from '@/ui'

const {
  notificationCount,
  showModal,
  onClose,
} = defineProps<{ notificationCount: number, showModal: boolean, onClose: () => void }>()
const { navigateToStudentNotifications } = useNavigation()

function navigateToNotifications () {
  navigateToStudentNotifications()
  onClose()
}
</script>

<template>
  <AvModal
    :title="notificationCount > 0 ? `${notificationCount} notifications non lues` : 'Aucune notification'"
    :icon="MDI_ICONS.NOTIFICATIONS_NONE"
    :opened="showModal"
    @close="onClose"
  >
    <div v-if="notificationCount === 0">
      <span class="b2-light">Vous recevrez une notification dans les cas suivants : </span>
      <ul class="b2-regular">
        <li><span>Un enseignant vous enverra un message</span></li>
        <li><span>Un tiers vous aura évalué sur une compétence</span></li>
        <li><span>Une trace a été validée</span></li>
        <li><span>Un évènement a lieu prochainement</span></li>
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
          label="Voir tout"
          variant="tertiary-no-outline"
          :icon="MDI_ICONS.ARROW_RIGHT"
          :on-click="navigateToNotifications"
        />
      </div>
    </template>
  </AvModal>
</template>

<style lang="scss" scoped>
:deep(.vicon) {
  color: var(--dark-background-primary1) !important;
}

ul {
  padding-left: 2rem;
}

.notifications-modal__footer {
  display: flex;
  flex: 1;
  justify-content: right;
}
</style>
