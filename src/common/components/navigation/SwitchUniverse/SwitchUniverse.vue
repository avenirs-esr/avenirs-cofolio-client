<script setup lang="ts">
import type { EUserCategory } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import { USER_CATEGORY_HOME } from '@/features/auth/global/composables/use-current-user/use-current-user.constants'
import { AvButton, AvIconText, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { categories, activeProfileCategory, canSwitchProfile, switchProfile } = useCurrentUser()
const { modalOpened, openModal, closeModal } = useModal()

async function handleSwitch (category: EUserCategory) {
  closeModal()
  await switchProfile(category)
}
</script>

<template>
  <AvButton
    :label="t('global.header.switchUniverse.label')"
    :icon="MDI_ICONS.SWAP_HORIZONTAL"
    :disabled="!canSwitchProfile"
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
        v-for="category in categories"
        :key="category"
        :label="t(`global.header.switchUniverse.buttons.${category}`)"
        theme="SECONDARY"
        :to="USER_CATEGORY_HOME[category]"
        :disabled="category === activeProfileCategory"
        :data-testid="`${category}-button`"
        @click="() => handleSwitch(category)"
      />
    </div>
  </AvModal>
</template>
