<script setup lang="ts">
import type { Slot } from 'vue'
import { type EUserCategory, invalidateGetNotifications, type NotificationDTO, useGetQuickLinks, useMarkAsSeen } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { BaseApiException } from '@/common/exceptions'
import NotificationsPopoverEmptyOrDisabled from '@/common/notifications/components/NotificationsPopoverEmptyOrDisabled/NotificationsPopoverEmptyOrDisabled.vue'
import NotificationsPopoverList from '@/common/notifications/components/NotificationsPopoverList/NotificationsPopoverList.vue'
import NotificationsPopoverPreferenceToggle from '@/common/notifications/components/NotificationsPopoverPreferenceToggle/NotificationsPopoverPreferenceToggle.vue'
import { usePaginatedNotifications } from '@/common/notifications/composables/use-paginated-notifications/use-paginated-notifications'
import { useToasterStore } from '@/store'
import { AvButton, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { userCategory } = defineProps<{ userCategory: EUserCategory }>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const slots = defineSlots<{
  default: Slot<{
    notification: NotificationDTO
    onRedirect: () => void
    onSeen: (id: string) => void
  }>
  empty?: Slot
}>()

const { t } = useI18n()
const queryClient = useQueryClient()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()

const { data: quickLinks } = useGetQuickLinks(userCategory)
const {
  notifications,
  error,
  isFetching,
  loadMoreNotifications,
  resetPagination
} = usePaginatedNotifications({ userCategory })
const { mutateAsync: markAsSeen } = useMarkAsSeen({
  mutation: {
    onError: (error: BaseApiException) => addErrorMessage({
      title: t('global.notifications.NotificationsPopover.markAsSeenError'),
      description: getErrorMessage(error)
    })
  }
})

const isSyncing = ref<boolean>(false)
const syncPromise = ref<Promise<void> | null>(null)
const seenQueue = ref<Set<string>>(new Set())

const hasUnseenNotifications = computed(() => quickLinks.value?.notificationEnabled && quickLinks.value?.unreadNotifications > 0)
const hasNotifications = computed(() => quickLinks.value?.notificationEnabled && notifications.value.length > 0)

const unseenNotificationsCounter = computed(() => hasUnseenNotifications.value ? (quickLinks.value!.unreadNotifications <= 99 ? quickLinks.value!.unreadNotifications : '99+') : 0)
const unseenNotificationsPlural = computed(() => hasUnseenNotifications.value ? quickLinks.value!.unreadNotifications : 0)

function syncNotifications () {
  if (syncPromise.value === null) {
    syncPromise.value = (async () => {
      isSyncing.value = true

      if (seenQueue.value.size !== 0) {
        await Promise.allSettled([...seenQueue.value].map(id => markAsSeen({ id })))
        seenQueue.value.clear()
      }

      resetPagination()
      await invalidateGetNotifications(queryClient, userCategory)
    })().catch((err) => {
      if (err instanceof BaseApiException) {
        addErrorMessage(getErrorMessage(err))
      }
      throw err
    }).finally(() => {
      isSyncing.value = false
      syncPromise.value = null
    })
  }

  return syncPromise.value
}

function handleSeen (id: string) {
  seenQueue.value.add(id)
}

function handleClose () {
  emit('close')
}

onUnmounted(syncNotifications)

watch(() => quickLinks.value?.unreadNotifications, syncNotifications)
</script>

<template>
  <div
    class="notifications-popover-body av-col av-gap-md"
    :class="{ 'notifications-popover-body--with-notifications': !isSyncing && hasNotifications }"
    data-testid="notifications-popover-body"
  >
    <div class="av-row">
      <AvIconText
        :text="t('global.notifications.NotificationsPopover.header', { count: unseenNotificationsCounter }, unseenNotificationsPlural)"
        :icon="MDI_ICONS.NOTIFICATIONS_NONE"
        text-color="var(--title)"
        icon-color="var(--dark-background-primary1)"
        typography-class="n6"
        gap="var(--spacing-md)"
        data-testid="notifications-popover-body-title"
      />
    </div>

    <div
      class="notifications-popover-body__list-wrapper av-row"
      data-testid="notifications-popover-body-list-wrapper"
    >
      <QuerySuspense
        :is-loading="isSyncing"
        :error="error"
        :is-empty="!hasNotifications"
      >
        <template #default>
          <NotificationsPopoverList
            :notifications="notifications"
            :is-fetching="isFetching"
            @load-more="loadMoreNotifications"
          >
            <template #default="{ notification }">
              <slot
                :notification="notification"
                :on-redirect="handleClose"
                :on-seen="handleSeen"
              />
            </template>
          </NotificationsPopoverList>
        </template>

        <template #empty>
          <NotificationsPopoverEmptyOrDisabled :user-category="userCategory">
            <slot
              v-if="slots.empty"
              name="empty"
            />
          </NotificationsPopoverEmptyOrDisabled>
        </template>
      </QuerySuspense>
    </div>

    <div class="av-row av-justify-between av-align-center av-gap-sm">
      <NotificationsPopoverPreferenceToggle :user-category="userCategory" />

      <AvButton
        :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        :label="t('global.buttons.exit')"
        variant="OUTLINED"
        small
        data-testid="notifications-popover-body-close"
        @click="handleClose"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notifications-popover-body {
  width: min(30rem, 100vw);
  max-height: min(49.375rem, 100svh);

  &--with-notifications {
    height: min(49.375rem, 100svh);
  }

  &__list-wrapper {
    min-height: 0;
    flex: 1;
  }
}
</style>
