<script setup lang="ts">
import { useNavigation } from '@/common/composables'
import { AvButton, AvCancelConfirmButtons, AvIconText, AvPopover, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const {
  messagesCount,
} = defineProps<{ messagesCount: number }>()

const { navigateToStudentMailbox } = useNavigation()
const { t } = useI18n()
</script>

<template>
  <AvPopover
    width="30rem"
    padding="var(--spacing-md)"
  >
    <template #trigger="{ toggle }">
      <AvButton
        :label="t('student.layout.header.quicklinks.mailbox')"
        :on-click="toggle"
        :icon="MDI_ICONS.CHAT_BUBBLE_OUTLINE"
        small
      />
    </template>
    <template #popover="{ close }">
      <div class="container">
        <AvIconText
          data-testid="mailbox-popover-title"
          :text="t('student.overlays.mailboxPopover.title', { count: messagesCount })"
          :icon="MDI_ICONS.CHAT_BUBBLE_OUTLINE"
          text-color="var(--title)"
          icon-color="var(--dark-background-primary1)"
          typography-class="n6"
          gap="var(--spacing-md)"
        />
        <div v-if="messagesCount === 0">
          <span class="b2-light">{{ t('student.overlays.mailboxPopover.bodyNoNew') }}</span>
        </div>
        <div v-else>
          Messages...
        </div>
        <div class="footer">
          <AvCancelConfirmButtons
            :cancel-label="t('global.buttons.exit')"
            :confirm-label="messagesCount === 0 ? t('student.overlays.mailboxPopover.buttons.navigate') : t('student.overlays.mailboxPopover.buttons.seeAll')"
            :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
            :confirm-icon="MDI_ICONS.ARROW_RIGHT_THIN"
            @cancel="close"
            @confirm="navigateToStudentMailbox"
          />
        </div>
      </div>
    </template>
  </AvPopover>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
