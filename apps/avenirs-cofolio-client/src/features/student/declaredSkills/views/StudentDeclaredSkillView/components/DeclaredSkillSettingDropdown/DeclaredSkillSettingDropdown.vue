<script lang="ts" setup>
import type { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useI18n } from 'vue-i18n'
import { EAssociationContextType } from '@/api/avenir-esr'
import ManageAssociableEntityDropdown from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { handleEntityDropdownAction, OWN_ACTIONS } from '@/common/utils/constants'

export interface DeclaredSkillSettingDropdownProps {
  elementId: string
  hasAssociations: boolean
}

const { elementId, hasAssociations } = defineProps<DeclaredSkillSettingDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.UPDATE | Action.DELETE

const { t } = useI18n()

const ownActions = computed(() => OWN_ACTIONS)

function onAction (action: Action, handleAction: (a: Action) => void) {
  handleEntityDropdownAction(action, handleAction, action => emit(action))
}
</script>

<template>
  <ManageAssociableEntityDropdown
    :context-type="EAssociationContextType.DECLARED_SKILL"
    :element-id="elementId"
    :has-associations="hasAssociations"
  >
    <template #default="{ associateAction, dissociateAction, handleAction }">
      <ManageEntityDropdown
        :entity-name="t('student.declaredSkills.views.StudentDeclaredSkillView.settingDropdown.entityName')"
        :actions="[...ownActions, associateAction, dissociateAction]"
        @action-selected="(action) => onAction(action, handleAction)"
      />
    </template>
  </ManageAssociableEntityDropdown>
</template>
