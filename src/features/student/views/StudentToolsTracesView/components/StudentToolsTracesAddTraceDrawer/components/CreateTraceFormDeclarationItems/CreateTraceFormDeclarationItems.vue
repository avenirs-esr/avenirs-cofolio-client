<script setup lang="ts">
import type {
  CreateTraceForm
} from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { TraceIaJustificationTextarea } from '@/features/student/components/inputs'
import { AvToggle } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface CreateTraceFormDeclarationItemsProps {
  form: CreateTraceForm
}

const props = defineProps<CreateTraceFormDeclarationItemsProps>()
const form: CreateTraceForm = props.form

const { t } = useI18n()

const useIAField = form.useField({ name: 'useIA' })
const iaJustificationField = form.useField({ name: 'iaJustification' })
const isAuthenticField = form.useField({ name: 'isAuthentic' })

const showIAJustification = computed(() => useIAField.state.value.value === true)
const authenticErrors = computed(() => isAuthenticField.state.value.meta.errors)

function handleToggleChange (fieldName: 'isAuthentic' | 'isGroup' | 'useIA', value: boolean, fieldChange: (value: boolean) => void) {
  fieldChange(value)

  if (fieldName === 'useIA' && !value) {
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
          <form.Field name="isAuthentic">
            <template #default="{ field }">
              <div class="declaration-items__inline-field">
                <AvToggle
                  id="isAuthentic"
                  name="isAuthentic"
                  :model-value="field.state.value"
                  :description="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.declaration.productionAuthenticity.label')"
                  :active-text="t('global.avToggle.activeText')"
                  :inactive-text="t('global.avToggle.inactiveText')"
                  @update:model-value="(value) => handleToggleChange('isAuthentic', value, field.handleChange)"
                />
              </div>
            </template>
          </form.Field>

          <form.Field name="isGroup">
            <template #default="{ field }">
              <div class="declaration-items__inline-field">
                <AvToggle
                  id="isGroup"
                  name="isGroup"
                  :model-value="field.state.value"
                  :description="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.declaration.groupProduction.label')"
                  :active-text="t('global.avToggle.activeText')"
                  :inactive-text="t('global.avToggle.inactiveText')"
                  @update:model-value="(value) => handleToggleChange('isGroup', value, field.handleChange)"
                />
              </div>
            </template>
          </form.Field>
        </div>

        <div
          v-if="authenticErrors.length > 0"
          class="declaration-items__authentic-error"
        >
          {{ authenticErrors.join(', ') }}
        </div>
      </div>

      <div class="declaration-items__section">
        <p class="declaration-items__section-title">
          {{ t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.declaration.iaUsage.title') }}
        </p>

        <form.Field name="useIA">
          <template #default="{ field }">
            <div class="declaration-items__field">
              <AvToggle
                id="useIA"
                name="useIA"
                :model-value="field.state.value"
                :description="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.declaration.iaUsage.label')"
                :active-text="t('global.avToggle.activeText')"
                :inactive-text="t('global.avToggle.inactiveText')"
                @update:model-value="(value) => handleToggleChange('useIA', value, field.handleChange)"
              />
              <div
                v-if="field.state.meta.errors.length > 0"
                class="declaration-items__error"
              >
                {{ field.state.meta.errors.join(', ') }}
              </div>
            </div>
          </template>
        </form.Field>

        <form.Field
          v-if="showIAJustification"
          name="iaJustification"
        >
          <template #default="{ field }">
            <TraceIaJustificationTextarea
              id="ia-justification"
              v-model="field.state.value"
              :error-message="field.state.meta.errors.join(', ')"
              :required="showIAJustification"
              @blur="field.handleBlur"
              @update:model-value="(value) => typeof value == 'string' ? field.handleChange(value) : field.handleChange(undefined)"
            />
          </template>
        </form.Field>
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

.declaration-items__inline-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
  flex: 0 0 auto;
}

.declaration-items__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
}

.declaration-items__error {
  font-size: var(--font-size-caption);
  color: var(--error-primary);
  margin-top: var(--spacing-xxs);
}

.declaration-items__authentic-error {
  font-size: var(--font-size-xs);
  color: var(--dark-background-error);
}

.declaration-items__inline-field {
  :deep(.av-toggle) {
    max-width: 20rem;

    :deep(.caption-regular) {
      word-break: break-word;
      hyphens: auto;
      line-height: 1.3;
    }
  }
}
</style>
