<script lang="ts" setup>
import { Action, type ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'

export interface ActivityLibraryDropdownProps {
  unsubscribeDisabled?: boolean
}

const { unsubscribeDisabled = false } = defineProps<ActivityLibraryDropdownProps>()

const emit = defineEmits<{
  (e: 'unsubscribeSelected'): void
}>()

const actions = computed<ActionItem[]>(() => [
  {
    type: Action.UNSUBSCRIBE,
    disabled: unsubscribeDisabled
  }
])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.UNSUBSCRIBE: return emit('unsubscribeSelected')
  }
}
</script>

<template>
  <ManageEntityDropdown
    :actions
    data-testid="activity-library-dropdown"
    @action-selected="handleActionSelected"
  />
</template>
