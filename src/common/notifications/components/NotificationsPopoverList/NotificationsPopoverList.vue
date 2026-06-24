<script setup lang="ts">
import type { NotificationDTO } from '@/api/avenir-esr'
import type { Slot } from 'vue'
import Loader from '@/common/components/Loader/Loader.vue'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import { useInfiniteScroll } from '@vueuse/core'

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
