<script setup lang="ts">
import UserProfileDropdown from '@/common/components/overlay/UserProfileDropdown/UserProfileDropdown.vue'

const { username } = defineProps<{ username: string }>()
</script>

<template>
  <UserProfileDropdown :username="username" />
</template>
