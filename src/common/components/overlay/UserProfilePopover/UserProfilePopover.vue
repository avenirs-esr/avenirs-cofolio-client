<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { AvButton, AvPopover, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface UserProfilePopoverAction {
  label: string
  icon: string
  onClick?: () => void
  hidden?: boolean
}

const { username, actions = [] } = defineProps<{
  username: string
  actions?: UserProfilePopoverAction[]
}>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

function logOut () {
  window.location.assign(__AUTH_LOGOUT_URL__)
}
</script>

<template>
  <AvPopover padding="var(--spacing-xs)">
    <template #trigger="{ toggle }">
      <AvButton
        :label="username"
        :icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
        small
        no-sentence-case
        @click="toggle"
      />
    </template>

    <template #popover>
      <ul class="av-list-reset">
        <li
          v-for="action in actions.filter(action => !action.hidden)"
          :key="action.label"
        >
          <AvButton
            :label="action.label"
            :icon="action.icon"
            variant="DEFAULT"
            theme="SECONDARY"
            small
            no-radius
            @click="action.onClick"
          />
        </li>

        <li>
          <AvButton
            :label="t('global.buttons.logout')"
            :icon="MDI_ICONS.LOGOUT"
            variant="DEFAULT"
            theme="SECONDARY"
            small
            no-radius
            @click="displayModal"
          />
        </li>
      </ul>
    </template>
  </AvPopover>

  <ConfirmationModal
    :show="showModal"
    :title="t('global.logoutModal.title')"
    :description="t('global.logoutModal.description')"
    :confirm-button-label="t('global.buttons.confirm')"
    :close-button-label="t('global.buttons.cancel')"
    @confirm="logOut"
    @close="hideModal"
  />
</template>

<style scoped lang="scss">
li > .av-button {
  width: 100% !important;
}
</style>
