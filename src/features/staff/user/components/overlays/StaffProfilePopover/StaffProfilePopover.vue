<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { AvButton, AvPopover, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { username } = defineProps<{ username: string }>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

function askLogoutConfirmation () {
  displayModal()
}

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
        <li>
          <AvButton
            :label="t('staff.user.overlays.StaffProfilePopover.buttons.logout')"
            :icon="MDI_ICONS.LOGOUT"
            variant="DEFAULT"
            theme="SECONDARY"
            small
            no-radius
            @click="askLogoutConfirmation"
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

<style lang="scss" scoped>
li > .av-button {
  width: 100% !important;
}
</style>
