<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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
const { showModal, displayModal, hideModal } = useModal()

const logoutActionName = 'logout-button'

const dropdownItems = computed(() => [
  ...actions,
  {
    name: logoutActionName,
    label: t('global.buttons.logout'),
    icon: MDI_ICONS.LOGOUT,
  },
])

function onItemSelected (itemName: string) {
  if (itemName === logoutActionName) {
    displayModal()
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
    :items="dropdownItems"
    :trigger-label="username"
    :trigger-aria-label="username"
    :trigger-icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
    trigger-variant="DEFAULT"
    @item-selected="onItemSelected"
  />

  <ConfirmationModal
    data-testid="logout-confirmation-modal"
    :show="showModal"
    :title="t('global.logoutModal.title')"
    :description="t('global.logoutModal.description')"
    :confirm-button-label="t('global.buttons.confirm')"
    :close-button-label="t('global.buttons.cancel')"
    @confirm="logOut"
    @close="hideModal"
  />
</template>
