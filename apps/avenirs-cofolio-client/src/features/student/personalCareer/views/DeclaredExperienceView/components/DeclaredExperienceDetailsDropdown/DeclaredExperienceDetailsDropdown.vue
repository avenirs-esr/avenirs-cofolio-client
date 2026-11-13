<script setup lang="ts">
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageAssociableEntityDropdown from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'

export interface DeclaredExperienceDetailsDropdownProps {
  declaredExperienceId: string
}

defineProps<DeclaredExperienceDetailsDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.UPDATE | Action.DELETE

const { t } = useI18n()

const actions = computed<Action[]>(() => [Action.UPDATE, Action.DELETE])
</script>

<template>
  <div class="av-row av-justify-end">
    <ManageAssociableEntityDropdown
      :actions="actions"
      :entity-name="t('student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetailsDropdown.entityName')"
      :element-id="declaredExperienceId"
      :context-type="EAssociationContextType.DECLARED_EXPERIENCE"
      @update="() => emit(Action.UPDATE)"
      @delete="() => emit(Action.DELETE)"
    />
  </div>
</template>
