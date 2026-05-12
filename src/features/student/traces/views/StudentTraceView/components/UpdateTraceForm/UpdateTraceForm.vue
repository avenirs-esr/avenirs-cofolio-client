<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import { useDateUtils } from '@/common/composables'
import TraceAiJustificationTextareaFormField from '@/features/student/traces/components/interactions/formFields/TraceAiJustificationTextareaFormField/TraceAiJustificationTextareaFormField.vue'
import TraceAiUsageToggleFormField from '@/features/student/traces/components/interactions/formFields/TraceAiUsageToggleFormField/TraceAiUsageToggleFormField.vue'
import TraceAuthenticDeclarationToggleFormField from '@/features/student/traces/components/interactions/formFields/TraceAuthenticDeclarationToggleFormField/TraceAuthenticDeclarationToggleFormField.vue'
import TraceFileUploadFormField from '@/features/student/traces/components/interactions/formFields/TraceFileUploadFormField/TraceFileUploadFormField.vue'
import TraceGroupProductionToggleFormField from '@/features/student/traces/components/interactions/formFields/TraceGroupProductionToggleFormField/TraceGroupProductionToggleFormField.vue'
import TraceLinkInputFormField from '@/features/student/traces/components/interactions/formFields/TraceLinkInputFormField/TraceLinkInputFormField.vue'
import TraceNameInputFormField from '@/features/student/traces/components/interactions/formFields/TraceNameInputFormField/TraceNameInputFormField.vue'
import TracePersonalNoteTextareaFormField from '@/features/student/traces/components/interactions/formFields/TracePersonalNoteTextareaFormField/TracePersonalNoteTextareaFormField.vue'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { TraceType } from '@/features/student/traces/types/traces.types'
import { useUpdateTraceForm } from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

const { trace } = defineProps<UpdateTraceFormProps>()
interface UpdateTraceFormProps {
  trace: TraceDetailDTO
}

const { addSuccessMessage } = useToasterStore()
const { hideUpdateTraceModal } = useTracesStore()

const { t } = useI18n()

function onTraceUpdated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.traces.views.StudentTraceView.updateTraceModal.success')
  })
  hideUpdateTraceModal()
}

const { form } = useUpdateTraceForm(trace, onTraceUpdated)
const { formatTranslatedDateTime } = useDateUtils()

const useIAField = form.useField({ name: 'useIA' })
const iaJustificationField = form.useField({ name: 'iaJustification' })

const showIAJustification = computed(() => useIAField.state.value.value === true)

function onChangeAiUsageToggle (value: boolean) {
  if (!value) {
    iaJustificationField.api.handleChange('')
  }
}
const traceFileUploadLabel = computed(() => {
  if (!trace.attachment) {
    return ''
  }

  const uploadDate = formatTranslatedDateTime(trace.attachment?.uploadedAt ?? '')
  return `${t('student.traces.interactions.inputs.TraceFileUpload.documentLabel')} - ${t('student.traces.interactions.inputs.TraceFileUpload.addedOn', { date: uploadDate })}`
})
</script>

<template>
  <form
    class="update-trace-form av-col av-gap-lg av-w-full"
    novalidate
    @submit.prevent.stop="form.handleSubmit"
  >
    <div class="av-row av-gap-lg av-w-full">
      <div class="av-col av-gap-lg av-flex-fill">
        <TraceNameInputFormField :form="form" />

        <TraceFileUploadFormField
          v-if="form.getFieldValue('traceType') === TraceType.FILE"
          :form="form"
          :label="traceFileUploadLabel"
        />
        <TraceLinkInputFormField
          v-else
          :form="form"
        />
      </div>

      <div class="av-col av-gap-lg av-flex-fill">
        <TracePersonalNoteTextareaFormField :form="form" />
      </div>
    </div>

    <div class="av-row av-gap-lg av-w-full">
      <div class="av-col av-gap-lg av-flex-fill">
        <div class="av-col av-gap-xs">
          <span class="caption-regular">
            {{ t('student.traces.views.StudentTraceView.updateTraceModal.updateTraceForm.declaration.productionNature.title') }}
          </span>

          <div class="av-col av-gap-xs">
            <TraceAuthenticDeclarationToggleFormField :form="form" />

            <TraceGroupProductionToggleFormField :form="form" />
          </div>
        </div>
      </div>

      <div class="av-col av-gap-lg av-flex-fill">
        <div class="av-col av-gap-xs">
          <span class="caption-regular">
            {{ t('student.traces.views.StudentTraceView.updateTraceModal.updateTraceForm.declaration.iaUsage.title') }}
          </span>

          <TraceAiUsageToggleFormField
            :form="form"
            @change="onChangeAiUsageToggle"
          />

          <TraceAiJustificationTextareaFormField
            :form="form"
            :show-ai-justification="showIAJustification"
            :label-visible="false"
          />
        </div>
      </div>
    </div>
  </form>
</template>
