<script lang="ts" setup>
import type { EGroupType } from '@/api/avenir-esr'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useGroupTypeConfig } from '@/features/staff/admin/views/AdminInstitutionGroupsView/composables/use-group-type-config/use-group-type-config'

export interface GroupTypeBadgeProps {
  type: EGroupType
}

const { type } = defineProps<GroupTypeBadgeProps>()

const { getGroupTypeConfig } = useGroupTypeConfig()
const { label, icon } = getGroupTypeConfig(type)
</script>

<template>
  <AvBadge
    :label="label"
    :icon="icon"
    background-color="var(--light-background-neutral)"
    color="var(--light-foreground-neutral)"
    data-testid="group-type-badge"
    ellipsis
  />
</template>
