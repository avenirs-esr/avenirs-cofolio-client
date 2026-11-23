<!-- UserCategoryBadge.vue -->
<script setup lang="ts">
import type { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useUserCategoryConfig } from '@/features/staff/admin/composables/use-user-category-config/use-user-category-config'

interface UserCategoryBadgeProps {
  category: EUserCategory
}

const { category } = defineProps<UserCategoryBadgeProps>()

const { getUserCategoryConfig } = useUserCategoryConfig()
const { label, icon, color, backgroundColor } = getUserCategoryConfig(category)
</script>

<template>
  <AvBadge
    :label="label"
    :icon="icon"
    :background-color="backgroundColor"
    :color="color"
    data-testid="user-category-badge"
    ellipsis
  />
</template>
