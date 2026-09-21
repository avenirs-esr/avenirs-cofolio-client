<script lang="ts" setup>
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'deleteSelected'): void
}>()

const { t } = useI18n()

const actions = computed(() => [Action.DELETE])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.DELETE: return emit('deleteSelected')
  }
}
</script>

<template>
  <ManageEntityDropdown
    :entity-name="t('student.traces.myTrace')"
    :actions
    data-testid="traces-actions-dropdown"
    @action-selected="handleActionSelected"
  />
</template>
