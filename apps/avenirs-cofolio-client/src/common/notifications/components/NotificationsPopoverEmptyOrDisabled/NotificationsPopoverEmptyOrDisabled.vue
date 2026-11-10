<script setup lang="ts">
import type { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import type { Slot } from 'vue'
import { useGetQuickLinks } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'

const { userCategory } = defineProps<{ userCategory: EUserCategory }>()

defineSlots<{
  default?: Slot
}>()

const { t } = useI18n()

const { data } = useGetQuickLinks(userCategory, {
  query: { refetchOnMount: false }
})
</script>

<template>
  <div class="av-col">
    <slot v-if="data?.notificationEnabled">
      <span data-testid="notifications-popover-no-notifications">
        {{ t('global.notifications.NotificationsPopover.notifications.none') }}
      </span>
    </slot>

    <span
      v-else
      data-testid="notifications-popover-disabled"
    >
      {{ t('global.notifications.NotificationsPopover.notifications.disabled') }}
    </span>
  </div>
</template>
