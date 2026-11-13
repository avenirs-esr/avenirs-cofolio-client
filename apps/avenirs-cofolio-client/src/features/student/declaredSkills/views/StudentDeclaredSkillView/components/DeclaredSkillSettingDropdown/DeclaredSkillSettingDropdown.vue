<script lang="ts" setup>
import type { ManageEntityDropdownProps } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageAssociableEntityDropdown from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'

export interface DeclaredSkillSettingDropdownProps {
  declaredSkillId: string
}

defineProps<DeclaredSkillSettingDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.UPDATE | Action.DELETE

const { t } = useI18n()

const actions = computed<ManageEntityDropdownProps['actions']>(() => [
  Action.UPDATE,
  Action.DELETE,
])
</script>

<template>
  <ManageAssociableEntityDropdown
    :actions="actions"
    :entity-name="t('student.declaredSkills.views.StudentDeclaredSkillView.settingDropdown.entityName')"
    :context-type="EAssociationContextType.DECLARED_SKILL"
    :element-id="declaredSkillId"
    @update="() => emit(Action.UPDATE)"
    @delete="() => emit(Action.DELETE)"
  />
</template>
