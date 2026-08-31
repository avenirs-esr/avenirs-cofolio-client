<script setup lang="ts">
import type { CreateTraceForm } from '@/features/traces/types/forms.types'
import TraceAiJustificationTextareaFormField from '@/features/traces/components/interactions/formFields/TraceAiJustificationTextareaFormField/TraceAiJustificationTextareaFormField.vue'
import TraceAiUsageToggleFormField from '@/features/traces/components/interactions/formFields/TraceAiUsageToggleFormField/TraceAiUsageToggleFormField.vue'
import TraceAuthorTypeRadioSetFormField from '@/features/traces/components/interactions/radios/TraceAuthorTypeRadioSetFormField/TraceAuthorTypeRadioSetFormField.vue'
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
  <div class="create-trace-form-declaration-items av-col av-p-md">
    <div
      class="av-col av-gap-lg"
      data-testid="declaration-items__content"
    >
      <div
        class="av-col av-gap-xs"
        data-testid="nature-section"
      >
        <span class="caption-regular">
          {{ t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.declaration.productionNature.title') }}
        </span>

        <TraceAuthorTypeRadioSetFormField :form="form" />
      </div>

      <div
        class="av-col av-gap-xs"
        data-testid="ia-usage-section"
      >
        <span class="caption-regular">
          {{ t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.declaration.iaUsage.title') }}
        </span>

        <div class="av-col av-gap-xxs">
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
