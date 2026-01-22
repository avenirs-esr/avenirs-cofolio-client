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
  <AvPopover padding="var(--spacing-md)">
    <template #trigger="{ toggle }">
      <AvButton
        :label="t('student.global.layout.header.quicklinks.mailbox')"
        :icon="MDI_ICONS.CHAT_BUBBLE_OUTLINE"
        small
        @click="toggle"
      />
    </template>
    <template #popover="{ close }">
      <div class="av-col av-gap-md">
        <AvIconText
          data-testid="mailbox-popover-title"
          :text="t('student.user.overlays.StudentMailboxPopover.title', { count: messagesCount })"
          :icon="MDI_ICONS.CHAT_BUBBLE_OUTLINE"
          text-color="var(--title)"
          icon-color="var(--dark-background-primary1)"
          typography-class="n6"
          gap="var(--spacing-md)"
        />
        <div v-if="messagesCount === 0">
          <span class="b2-light">{{ t('student.user.overlays.StudentMailboxPopover.bodyNoNew') }}</span>
        </div>
        <div v-else>
          Messages...
        </div>
        <div class="av-row av-justify-end">
          <AvCancelConfirmButtons
            :cancel-label="t('global.buttons.exit')"
            :confirm-label="messagesCount === 0 ? t('student.user.overlays.StudentMailboxPopover.buttons.navigate') : t('student.user.overlays.StudentMailboxPopover.buttons.seeAll')"
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
