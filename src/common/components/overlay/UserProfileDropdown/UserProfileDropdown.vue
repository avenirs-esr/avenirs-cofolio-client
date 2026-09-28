<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useTutorial } from '@/common/components/overlay/tooltips/Tutorial/use-tutorial'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface UserProfileDropdownAction {
  name: string
  label: string
  icon: string
  disabled?: boolean
}

const { username, actions = [] } = defineProps<{
  username: string
  actions?: UserProfileDropdownAction[]
}>()

const emit = defineEmits<{
  (e: 'actionSelected', actionName: string): void
}>()

const { t } = useI18n()
const { modalOpened, openModal, closeModal } = useModal()
const { replayTutorial } = useTutorial()

enum UserProfileDropdownEvents {
  REWATCH_TUTORIAL = 'rewatch-tutorial',
  LOGOUT = 'logout-button'
}

const dropdownItems = computed<AvDropdownItem[]>(() => [
  ...actions,
  {
    name: UserProfileDropdownEvents.REWATCH_TUTORIAL,
    label: t('global.buttons.rewatchTutorial'),
    icon: MDI_ICONS.REFRESH,
  },
  {
    name: UserProfileDropdownEvents.LOGOUT,
    label: t('global.buttons.logout'),
    icon: MDI_ICONS.LOGOUT,
    separatorBefore: true
  },
])

function onItemSelected (itemName: string) {
  if (itemName === UserProfileDropdownEvents.LOGOUT) {
    openModal()
    return
  }

  if (itemName === UserProfileDropdownEvents.REWATCH_TUTORIAL) {
    replayTutorial()
    return
  }

  emit('actionSelected', itemName)
}

function logOut () {
  window.location.assign(__AUTH_LOGOUT_URL__)
}
</script>

<template>
  <AvDropdown
    id="profile-dropdown"
    :items="dropdownItems"
    :trigger-label="username"
    :trigger-aria-label="username"
    :trigger-icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
    trigger-variant="DEFAULT"
    @item-selected="onItemSelected"
  />

  <ConfirmationModal
    data-testid="logout-confirmation-modal"
    :opened="modalOpened"
    :title="t('global.logoutModal.title')"
    :description="t('global.logoutModal.description')"
    :confirm-button-label="t('global.buttons.confirm')"
    :close-button-label="t('global.buttons.cancel')"
    @confirm="logOut"
    @close="closeModal"
  />
</template>
