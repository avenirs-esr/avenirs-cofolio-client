<script lang="ts" setup>
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'deleteSelected'): void
}>()

const { t } = useI18n()

const actions = computed<Action[]>(() => [Action.UPDATE, Action.DELETE])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.UPDATE:
      emit('updateSelected')
      break
    case Action.DELETE:
      emit('deleteSelected')
      break
  }
}
</script>

<template>
  <ManageEntityDropdown
    :actions="actions"
    :entity-name="t('global.ManageEntityDropdown.entityNames.element')"
    width="max-content"
    @action-selected="handleActionSelected"
  />
</template>

<style lang="scss" scoped>
</style>
