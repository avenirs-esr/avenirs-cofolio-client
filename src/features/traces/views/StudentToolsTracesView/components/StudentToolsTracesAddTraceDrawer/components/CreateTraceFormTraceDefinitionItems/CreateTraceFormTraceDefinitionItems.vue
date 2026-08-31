<script setup lang="ts">
import type { CreateTraceForm } from '@/features/traces/types/forms.types'
import TraceFileUploadFormField from '@/features/traces/components/interactions/formFields/TraceFileUploadFormField/TraceFileUploadFormField.vue'
import TraceLinkInputFormField from '@/features/traces/components/interactions/formFields/TraceLinkInputFormField/TraceLinkInputFormField.vue'
import TraceNameInputFormField from '@/features/traces/components/interactions/formFields/TraceNameInputFormField/TraceNameInputFormField.vue'
import TracePersonalNoteTextareaFormField from '@/features/traces/components/interactions/formFields/TracePersonalNoteTextareaFormField/TracePersonalNoteTextareaFormField.vue'
import { TraceType } from '@/features/traces/types/traces.types'
import TraceTypeSelect from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/TraceTypeSelect/TraceTypeSelect.vue'

interface CreateTraceFormTraceDefinitionItemsProps {
  form: CreateTraceForm
}

const { form } = defineProps<CreateTraceFormTraceDefinitionItemsProps>()

const selectedTraceType = ref({ itemId: TraceType.FILE })

watch(selectedTraceType, (newType) => {
  form.setFieldValue('traceType', newType.itemId)
})

function handleFileSelected (file: File) {
  if (file && form.getFieldValue('traceName') === '') {
    form.setFieldValue('traceName', file.name)
  }
}

function handleFileDeleted (fileName: string) {
  if (form.getFieldValue('traceName') === fileName) {
    form.setFieldValue('traceName', '')
  }
}
</script>

<template>
  <div class="create-trace-form-trace-definition-items av-col av-p-md">
    <div
      class="av-col av-gap-lg"
      data-testid="form-fields-container"
    >
      <TraceTypeSelect v-model:trace-type="selectedTraceType" />

      <div
        v-if="selectedTraceType.itemId === TraceType.FILE"
        class="av-col"
      >
        <TraceFileUploadFormField
          :form="form"
          @file-selected="handleFileSelected"
          @file-deleted="handleFileDeleted"
        />
      </div>

      <div
        v-else
        class="av-col"
      >
        <TraceLinkInputFormField :form="form" />
      </div>

      <div class="av-col">
        <TraceNameInputFormField
          :form="form"
        />
      </div>

      <div class="av-col">
        <TracePersonalNoteTextareaFormField
          :form="form"
        />
      </div>
    </div>
  </div>
</template>
