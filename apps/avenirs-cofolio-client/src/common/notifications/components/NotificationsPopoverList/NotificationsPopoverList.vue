<script setup lang="ts">
import type { Slot } from 'vue'
import type { NotificationDTO } from '@/api/avenir-esr'
import { Loader } from '@avenirs-esr/shared'
import { useInfiniteScroll } from '@vueuse/core'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'

const {
  notifications,
  isFetching
} = defineProps<{
  notifications: NotificationDTO[]
  isFetching: boolean
}>()

const emit = defineEmits<{
  (e: 'loadMore'): void
}>()

defineSlots<{
  default: Slot<{ notification: NotificationDTO }>
}>()

const notificationsList = ref<HTMLElement | null>(null)

useInfiniteScroll(
  notificationsList,
  () => emit('loadMore'),
  { distance: INFINITE_SCROLL_BOTTOM_DISTANCE }
)
</script>

<template>
  <div
    ref="notificationsList"
    class="notifications-popover-list av-col av-h-full av-px-xs av-pt-xs av-gap-sm"
    data-testid="notifications-popover-list"
  >
    <template
      v-for="n in notifications"
      :key="n.id"
    >
      <slot :notification="n" />
    </template>
    <Loader :is-loading="isFetching" />
  </div>
</template>

<style lang="scss" scoped>
.notifications-popover-list {
  overflow-y: auto;
}
</style>
