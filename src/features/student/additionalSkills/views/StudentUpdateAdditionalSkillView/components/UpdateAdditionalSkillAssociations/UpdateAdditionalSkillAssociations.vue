<script setup lang="ts">
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import {
  useUnassociateTracesFromAdditionalSkillMutation
} from '@/features/student/additionalSkills/queries/use-additional-skills.query/use-additional-skills.query'
import TracesSelector from '@/features/student/traces/components/interactions/pickers/TracesSelector/TracesSelector.vue'
import { useToasterStore } from '@/store'
import { AvButton, AvCard, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateAdditionalSkillAssociationsProps {
  additionalSkillId: string
  traceAssociations: TraceOverviewDTO[]
}

const { traceAssociations, additionalSkillId } = defineProps<UpdateAdditionalSkillAssociationsProps>()
const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

const selectedTraceIds = ref<string[]>([])

function onSuccess () {
  addSuccessMessage(t('student.views.studentUpdateAdditionalSkillView.updateAssociations.success', {
    count: selectedTraceIds.value.length
  }))
  selectedTraceIds.value = []
}

function onError () {
  addErrorMessage(t('student.views.studentUpdateAdditionalSkillView.updateAssociations.errors.unassociateTraces'))
}

const { mutate: unassociateTraces, isPending } = useUnassociateTracesFromAdditionalSkillMutation({
  onSuccess,
  onError
})

async function handleRemoveAssociations () {
  if (selectedTraceIds.value.length === 0) {
    return
  }
  unassociateTraces({
    additionalSkillProgressId: additionalSkillId,
    traceIds: selectedTraceIds.value
  })
}
</script>

<template>
  <div class="update-additional-skill-associations">
    <div class="update-additional-skill-associations__header">
      <span class="b2-regular">
        {{ t('student.global.myAssociatedTracesWithCount', { count: traceAssociations.length }) }}</span>
    </div>
    <AvCard class="demo-display-none update-additional-skill-associations__container">
      <template #body>
        <div class="update-additional-skill-associations__card-actions">
          <AvButton
            :label="t('student.views.studentUpdateAdditionalSkillView.updateAssociations.removeButton')"
            :disabled="isPending || selectedTraceIds.length === 0"
            variant="OUTLINED"
            size="sm"
            @click="handleRemoveAssociations"
          />
        </div>
        <div class="update-additional-skill-associations__traces-list">
          <TracesSelector
            v-if="traceAssociations.length > 0"
            v-model="selectedTraceIds"
            :traces="traceAssociations"
          />
          <AvCard
            border-color="var(--surface-background)"
            class="update-additional-skill-associations__add-card"
          >
            <template #body>
              <AvButton
                :label="t('student.views.studentUpdateAdditionalSkillView.updateAssociations.addTraceButton')"
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
.update-additional-skill-associations {
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
