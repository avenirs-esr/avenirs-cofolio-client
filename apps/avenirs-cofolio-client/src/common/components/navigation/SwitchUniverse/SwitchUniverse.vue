<script setup lang="ts">
import { AvButton, AvIconText, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/common/composables'
import { UNIVERSE_HOME } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session.constants'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'

const { t } = useI18n()
const {
  universes: {
    available: availableUniverses,
    active: activeUniverse,
    canSwitch: canSwitchUniverse
  }
} = useCurrentUser()
const { modalOpened, openModal, closeModal } = useModal()
</script>

<template>
  <AvButton
    :label="t('global.header.switchUniverse.label')"
    :icon="MDI_ICONS.SWAP_HORIZONTAL"
    :disabled="!canSwitchUniverse"
    @click="openModal"
  />
  <AvModal
    :opened="modalOpened"
    :close-button-label="t('global.buttons.exit')"
    @close="closeModal"
  >
    <template #header>
      <AvIconText
        :icon="MDI_ICONS.SWAP_HORIZONTAL"
        icon-color="var(--dark-background-primary1)"
        :text="t('global.header.switchUniverse.label')"
        text-color="var(--title)"
        typography-class="n6"
        gap="var(--spacing-sm)"
      />
    </template>
    <div class="av-col av-gap-lg">
      <AvButton
        v-for="universe in availableUniverses"
        :key="universe"
        :label="t(`global.universes.${universe}`)"
        theme="SECONDARY"
        :to="UNIVERSE_HOME[universe]"
        :disabled="universe === activeUniverse"
        :disabled-tooltip="t('global.header.switchUniverse.disabledTooltip')"
        :data-testid="`${universe}-button`"
        @click="closeModal()"
      />
    </div>
  </AvModal>
</template>
