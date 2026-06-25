<script setup lang="ts">
import UserProfilePopover from '@/common/components/overlay/UserProfilePopover/UserProfilePopover.vue'

const { username } = defineProps<{ username: string }>()
</script>

<template>
  <UserProfilePopover :username="username" />
</template>
