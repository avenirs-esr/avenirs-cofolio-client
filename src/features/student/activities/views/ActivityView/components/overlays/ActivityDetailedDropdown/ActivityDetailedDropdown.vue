<script lang="ts" setup>
import type { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

export interface ActivityDetailedDropdownProps {
  status: EDeclaredActivityStatus
}

const { status } = defineProps<ActivityDetailedDropdownProps>()

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'unsubscribeSelected'): void
  (e: 'resubscribeSelected'): void
  (e: 'deleteSelected'): void
}>()

const { t } = useI18n()

const isUnsubscribed = computed(() => isDeclaredActivityUnsubscribed(status))

const actions = computed(() => isUnsubscribed.value ? [Action.RESUBSCRIBE, Action.DELETE] : [Action.UPDATE, Action.UNSUBSCRIBE])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.UPDATE: return emit('updateSelected')
    case Action.UNSUBSCRIBE: return emit('unsubscribeSelected')
    case Action.RESUBSCRIBE: return emit('resubscribeSelected')
    case Action.DELETE: return emit('deleteSelected')
  }
}
</script>

<template>
  <ManageEntityDropdown
    :entity-name="t('global.ManageEntityDropdown.entityNames.activity')"
    :actions
    @action-selected="handleActionSelected"
  />
</template>
