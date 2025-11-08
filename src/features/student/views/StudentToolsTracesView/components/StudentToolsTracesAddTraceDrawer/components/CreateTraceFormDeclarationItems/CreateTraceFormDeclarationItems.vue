<script setup lang="ts">
import type { CreateTraceForm } from '@/features/student/types'
import {
  TraceAiJustificationTextareaFormField,
  TraceAiUsageToggleFormField,
  TraceAuthenticDeclarationToggleFormField,
  TraceGroupProductionToggleFormField
} from '@/features/student/components/traces'
import { useI18n } from 'vue-i18n'

interface CreateTraceFormDeclarationItemsProps {
  form: CreateTraceForm
}

const { form } = defineProps<CreateTraceFormDeclarationItemsProps>()

const { t } = useI18n()

const useIAField = form.useField({ name: 'useIA' })
const iaJustificationField = form.useField({ name: 'iaJustification' })

const showIAJustification = computed(() => useIAField.state.value.value === true)

function onChangeAiUsageToggle (value: boolean) {
  if (!value) {
    iaJustificationField.api.handleChange('')
  }
}
</script>

<template>
  <div class="declaration-items">
    <div class="declaration-items__content">
      <div class="declaration-items__section">
        <p class="declaration-items__section-title">
          {{ t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.declaration.productionNature.title') }}
        </p>

        <div class="declaration-items__inline-toggles">
          <TraceAuthenticDeclarationToggleFormField
            :form="form"
          />

          <TraceGroupProductionToggleFormField
            :form="form"
          />
        </div>
      </div>

      <div class="declaration-items__section">
        <p class="declaration-items__section-title">
          {{ t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.declaration.iaUsage.title') }}
        </p>

        <div class="declaration-items__field">
          <TraceAiUsageToggleFormField
            :form="form"
            @change="onChangeAiUsageToggle"
          />
        </div>

        <TraceAiJustificationTextareaFormField
          :form="form"
          :show-ai-justification="showIAJustification"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.declaration-items {
  padding: var(--spacing-md);
}

.declaration-items__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.declaration-items__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.declaration-items__section-title {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
}

.declaration-items__inline-toggles {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  align-items: flex-start;
}

.declaration-items__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
}
</style>
