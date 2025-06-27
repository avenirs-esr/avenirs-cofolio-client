<script setup lang="ts">
import { useNavigation } from '@/common/composables/'
import { AvButton, AvIconText, AvPopover, MDI_ICONS } from '@/ui'
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
        :icon="MDI_ICONS.CHAT_BUBBLE"
      />
    </template>
    <template #popover="{ close }">
      <div class="container">
        <AvIconText
          data-testid="mailbox-popover-title"
          :text="t('student.overlays.mailboxPopover.title', { count: messagesCount })"
          :icon="MDI_ICONS.CHAT_BUBBLE"
          text-color="var(--foreground-title)"
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
          <AvButton
            :label="t('global.buttons.exit')"
            :icon="MDI_ICONS.CLOSE_CIRCLE"
            :on-click="close"
            size="sm"
          />
          <AvButton
            v-if="messagesCount === 0"
            data-testid="mailbox-popover-navigate-none"
            :label="t('student.overlays.mailboxPopover.buttons.navigate')"
            :icon="MDI_ICONS.ARROW_RIGHT"
            :on-click="navigateToStudentMailbox"
            size="sm"
          />
          <AvButton
            v-else
            data-testid="mailbox-popover-navigate-some"
            :label="t('student.overlays.mailboxPopover.buttons.seeAll')"
            :icon="MDI_ICONS.ARROW_RIGHT"
            :on-click="navigateToStudentMailbox"
            size="sm"
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
  flex: 1;
  justify-content: right;
  gap: var(--spacing-sm);
}
</style>
