<script lang="ts" setup>
import type { EAuthorization } from '@/api/avenir-esr'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useAuthorizationTypeConfig } from '@/features/staff/admin/views/InstitutionUserDetailedView/composables/use-authorization-type-config/use-authorization-type-config'

export interface AuthorizationTypeBadgeProps {
  type: EAuthorization
}

const { type } = defineProps<AuthorizationTypeBadgeProps>()

const { getAuthorizationTypeConfig } = useAuthorizationTypeConfig()
const { label, icon } = getAuthorizationTypeConfig(type)
</script>

<template>
  <AvBadge
    :label="label"
    :icon="icon"
    background-color="var(--light-background-neutral)"
    color="var(--light-foreground-neutral)"
    data-testid="authorization-type-badge"
    ellipsis
  />
</template>
