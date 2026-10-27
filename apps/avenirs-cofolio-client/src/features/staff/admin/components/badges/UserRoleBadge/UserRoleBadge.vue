<script lang="ts" setup>
import type { ERole } from '@/api/avenir-esr'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useUserRoleConfig } from '@/features/staff/admin/composables/use-user-role-config/use-user-role-config'

export interface UserRoleBadgeProps {
  role: ERole
}

const { role } = defineProps<UserRoleBadgeProps>()

const { getUserRoleConfig } = useUserRoleConfig()
const { label, icon, backgroundColor, color } = getUserRoleConfig(role)
</script>

<template>
  <AvBadge
    :label="label"
    :icon="icon"
    :background-color="backgroundColor"
    :color="color"
    data-testid="user-role-badge"
  />
</template>
