<script setup lang="ts">
import type { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useI18n } from 'vue-i18n'
import { EAssociationContextType } from '@/api/avenir-esr'
import ManageAssociableEntityDropdown from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { handleEntityDropdownAction, OWN_ACTIONS } from '@/common/utils/constants'

export interface DeclaredExperienceDetailsDropdownProps {
  elementId: string
  hasAssociations: boolean
}

const { elementId, hasAssociations } = defineProps<DeclaredExperienceDetailsDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

const { t } = useI18n()

type AllowedActions = Action.UPDATE | Action.DELETE

const ownActions = computed(() => OWN_ACTIONS)

function onAction (action: Action, handleAction: (a: Action) => void) {
  handleEntityDropdownAction(action, handleAction, action => emit(action))
}
</script>

<template>
  <ManageAssociableEntityDropdown
    :context-type="EAssociationContextType.DECLARED_EXPERIENCE"
    :element-id="elementId"
    :has-associations="hasAssociations"
  >
    <template #default="{ associateAction, dissociateAction, handleAction }">
      <ManageEntityDropdown
        :entity-name="t('student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetailsDropdown.entityName')"
        :actions="[...ownActions, associateAction, dissociateAction]"
        @action-selected="(action) => onAction(action, handleAction)"
      />
    </template>
  </ManageAssociableEntityDropdown>
</template>
