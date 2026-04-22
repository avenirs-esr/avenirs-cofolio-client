<script setup lang="ts">
import { type TraceOverviewDTO, useUnassociateTraces } from '@/api/avenir-esr'
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

const { mutate: mutateUnassociateTraces, isPending } = useUnassociateTraces()

function unassociateTraces () {
  mutateUnassociateTraces({
    declaredSkillProgressId: declaredSkillId,
    data: selectedTraceIds.value
  }, {
    onSuccess,
    onError
  })
}

async function handleRemoveAssociations () {
  if (selectedTraceIds.value.length === 0) {
    return
  }
  unassociateTraces()
}
</script>

<template>
  <div
    class="av-col av-gap-md"
    data-testid="update-declared-skill-associations"
  >
    <div
      class="av-row av-justify-between av-align-center"
      data-testid="update-declared-skill-associations__header"
    >
      <span class="b2-regular av-text-text2">
        {{ t('student.global.myAssociatedTracesWithCount', { count: traceAssociations.length }) }}</span>
    </div>
    <AvCard
      class="demo-display-none av-col"
      data-testid="update-declared-skill-associations__container"
    >
      <template #body>
        <div
          class="update-declared-skill-associations__card-actions av-row av-justify-end"
          data-testid="update-declared-skill-associations__card-actions"
        >
          <AvButton
            :label="t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateAssociations.removeButton')"
            :disabled="isPending || selectedTraceIds.length === 0"
            variant="OUTLINED"
            small
            data-testid="delete-trace-button"
            @click="handleRemoveAssociations"
          />
        </div>
        <div
          class="av-row av-wrap av-gap-md"
          data-testid="update-declared-skill-associations__traces-list"
        >
          <TracesSelector
            v-if="traceAssociations.length > 0"
            v-model="selectedTraceIds"
            :traces="traceAssociations"
          />
          <AvCard
            border-color="var(--surface-background)"
            class="update-declared-skill-associations__add-card av-row av-justify-center av-align-center av-my-md"
          >
            <template #body>
              <AvButton
                :label="t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateAssociations.addTraceButton')"
                :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
                :disabled="isPending"
                data-testid="add-trace-button"
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
  &__container,
  &__add-card {
    background-color: var(--surface-background) !important; // Override AvCard inline style
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

  &__add-card {
    width: 17.125rem;
    height: 14rem;
    border-radius: 1.5rem;
    border-color: var(--other-border-skill-card) !important; // Override AvCard inline style
  }
}
</style>
