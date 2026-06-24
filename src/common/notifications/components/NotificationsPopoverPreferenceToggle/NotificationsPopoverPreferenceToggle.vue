<script setup lang="ts">
import { type EUserCategory, getGetQuickLinksQueryKey, type QuickLinksDTO, useGetQuickLinks, useUpdateNotificationPreferences } from '@/api/avenir-esr'
import Toggle from '@/common/components/Toggle/Toggle.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { userCategory } = defineProps<{ userCategory: EUserCategory }>()

const { t } = useI18n()
const queryClient = useQueryClient()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()

const { data } = useGetQuickLinks(userCategory)
const queryKey = getGetQuickLinksQueryKey(userCategory)

const { mutate: updateNotificationPreferences } = useUpdateNotificationPreferences({
  mutation: {
    onMutate: async ({ data: { notificationEnabled } }) => {
      await queryClient.cancelQueries({ queryKey })

      const previous: QuickLinksDTO | undefined = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: QuickLinksDTO | undefined) => old ? { ...old, notificationEnabled } : old)

      return { previous }
    },
    onError: async (error, _, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previous)
      }

      addErrorMessage({
        title: t('global.notifications.NotificationsPopover.preferences.error'),
        description: getErrorMessage(error)
      })
    }
  }
})

const notificationsEnabled = computed({
  get: () => data.value?.notificationEnabled ?? false,
  set: (value) => {
    updateNotificationPreferences({
      data: { notificationEnabled: value }
    })
  }
})
</script>

<template>
  <Toggle
    v-model="notificationsEnabled"
    description=""
    :active-text="t('global.notifications.NotificationsPopover.preferences.enabled')"
    :inactive-text="t('global.notifications.NotificationsPopover.preferences.disabled')"
  />
</template>
