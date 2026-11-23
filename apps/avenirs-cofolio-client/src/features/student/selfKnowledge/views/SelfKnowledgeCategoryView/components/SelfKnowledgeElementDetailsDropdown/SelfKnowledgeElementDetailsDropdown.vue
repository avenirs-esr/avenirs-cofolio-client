<script lang="ts" setup>
import { Action, ManageEntityDropdown } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.UPDATE | Action.DELETE

const { t } = useI18n()

const actions = computed<Action[]>(() => [Action.UPDATE, Action.DELETE])
</script>

<template>
  <ManageEntityDropdown
    :actions="actions"
    :entity-name="t('global.ManageEntityDropdown.entityNames.element')"
    width="max-content"
    @action-selected="(action) => emit(action as AllowedActions)"
  />
</template>

<style lang="scss" scoped>
</style>
