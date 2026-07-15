<script setup lang="ts">
import type { Slot } from 'vue'
import { type EUserCategory, type NotificationDTO, useGetQuickLinks } from '@/api/avenir-esr'
import NotificationsPopoverBody from '@/common/notifications/components/NotificationsPopoverBody/NotificationsPopoverBody.vue'
import { AvButton, AvPopover, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { userCategory } = defineProps<{ userCategory: EUserCategory }>()

const slots = defineSlots<{
  default: Slot<{
    notification: NotificationDTO
    onRedirect: () => void
    onSeen: (id: string) => void
  }>
  empty?: Slot
}>()

const { t } = useI18n()

const { data } = useGetQuickLinks(userCategory)

const hasUnseenNotifications = computed(() => data.value?.notificationEnabled && data.value?.unreadNotifications > 0)
const unseenNotificationsCounter = computed(() => hasUnseenNotifications.value ? (data.value!.unreadNotifications <= 99 ? data.value!.unreadNotifications : '99+') : 0)
const unseenNotificationsPlural = computed(() => hasUnseenNotifications.value ? data.value!.unreadNotifications : 0)

const triggerLabel = computed(() => t('global.notifications.NotificationsPopover.trigger', { count: unseenNotificationsCounter.value }, unseenNotificationsPlural.value))
const triggerIcon = computed(() => hasUnseenNotifications.value ? MDI_ICONS.BELL_NOTIFICATION : MDI_ICONS.NOTIFICATIONS_NONE)
</script>

<template>
  <AvPopover
    padding="var(--spacing-md)"
    data-testid="notifications-popover"
  >
    <template #trigger="{ toggle }">
      <AvButton
        :label="triggerLabel"
        :icon="triggerIcon"
        small
        data-testid="notifications-popover-trigger"
        @click="toggle"
      />
    </template>

    <template #popover="{ close }">
      <NotificationsPopoverBody
        :user-category="userCategory"
        data-testid="notifications-popover-body"
        @close="close"
      >
        <template #default="{ notification, onRedirect, onSeen }">
          <slot
            :notification="notification"
            :on-redirect="onRedirect"
            :on-seen="onSeen"
          />
        </template>

        <template #empty>
          <slot
            v-if="slots.empty"
            name="empty"
          />
        </template>
      </NotificationsPopoverBody>
    </template>
  </AvPopover>
</template>
