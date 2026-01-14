<script setup lang="ts">
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import {
  useUnassociateTracesFromDeclaredSkillMutation
} from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import TracesSelector from '@/features/student/traces/components/interactions/pickers/TracesSelector/TracesSelector.vue'
import { useToasterStore } from '@/store'
import { AvButton, AvCard, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateDeclaredSkillAssociationsProps {
  declaredSkillId: string
  traceAssociations: TraceOverviewDTO[]
}

const { traceAssociations, declaredSkillId } = defineProps<UpdateDeclaredSkillAssociationsProps>()
const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

const selectedTraceIds = ref<string[]>([])

function onSuccess () {
  addSuccessMessage(t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateAssociations.success', {
    count: selectedTraceIds.value.length
  }))
  selectedTraceIds.value = []
}

function onError () {
  addErrorMessage(t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateAssociations.errors.unassociateTraces'))
}

const { mutate: unassociateTraces, isPending } = useUnassociateTracesFromDeclaredSkillMutation({
  onSuccess,
  onError
})

async function handleRemoveAssociations () {
  if (selectedTraceIds.value.length === 0) {
    return
  }
  unassociateTraces({
    declaredSkillProgressId: declaredSkillId,
    traceIds: selectedTraceIds.value
  })
}
</script>

<template>
  <div class="update-declared-skill-associations">
    <div class="update-declared-skill-associations__header">
      <span class="b2-regular">
        {{ t('student.global.myAssociatedTracesWithCount', { count: traceAssociations.length }) }}</span>
    </div>
    <AvCard class="demo-display-none update-declared-skill-associations__container">
      <template #body>
        <div class="update-declared-skill-associations__card-actions">
          <AvButton
            :label="t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateAssociations.removeButton')"
            :disabled="isPending || selectedTraceIds.length === 0"
            variant="OUTLINED"
            small
            @click="handleRemoveAssociations"
          />
        </div>
        <div class="update-declared-skill-associations__traces-list">
          <TracesSelector
            v-if="traceAssociations.length > 0"
            v-model="selectedTraceIds"
            :traces="traceAssociations"
          />
          <AvCard
            border-color="var(--surface-background)"
            class="update-declared-skill-associations__add-card"
          >
            <template #body>
              <AvButton
                :label="t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateAssociations.addTraceButton')"
                :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
                :disabled="isPending"
              />
            </template>
          </AvCard>
        </div>
      </template>
    </AvCard>
  </div>
</template>

<style scoped lang="scss">
.update-declared-skill-associations {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text2);
  }

  &__container,
  &__add-card {
    background-color: var(--surface-background) !important; // Override AvCard inline style
  }

  &__container {
    display: flex;
    flex-direction: column;
  }

  &__card-actions,
  &__add-card {
    :deep(.av-button--theme-primary) {
      background-color: transparent;
    }
    :deep(.av-button--theme-primary:hover) {
      color: var(--text1);
    }
  }

  &__card-actions {
    display: flex;
    justify-content: flex-end;
  }

  &__add-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 17.125rem;
    height: 14rem;
    border-radius: 1.5rem;
    margin: var(--spacing-md) 0;
    border-color: var(--other-border-skill-card) !important; // Override AvCard inline style
  }

  &__traces-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
}
</style>
