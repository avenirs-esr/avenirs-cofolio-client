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
  (e: AllowedAction): void
}>()

type AllowedAction = Action.UPDATE | Action.UNSUBSCRIBE | Action.RESUBSCRIBE | Action.DELETE

const { t } = useI18n()

const isUnsubscribed = computed(() => isDeclaredActivityUnsubscribed(status))

const actions = computed(() => isUnsubscribed.value ? [Action.RESUBSCRIBE, Action.DELETE] : [Action.UPDATE, Action.UNSUBSCRIBE])
</script>

<template>
  <ManageEntityDropdown
    :entity-name="t('global.ManageEntityDropdown.entityNames.activity')"
    :actions="actions"
    @action-selected="(action) => emit(action as AllowedAction)"
  />
</template>
