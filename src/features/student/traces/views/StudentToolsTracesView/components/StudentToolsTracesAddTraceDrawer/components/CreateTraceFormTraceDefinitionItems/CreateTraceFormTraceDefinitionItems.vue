<script setup lang="ts">
import type { CreateTraceForm } from '@/features/student/traces/types/forms.types'
import TraceFileUploadFormField from '@/features/student/traces/components/interactions/formFields/TraceFileUploadFormField/TraceFileUploadFormField.vue'
import TraceNameInputFormField from '@/features/student/traces/components/interactions/formFields/TraceNameInputFormField/TraceNameInputFormField.vue'
import TracePersonalNoteTextareaFormField from '@/features/student/traces/components/interactions/formFields/TracePersonalNoteTextareaFormField/TracePersonalNoteTextareaFormField.vue'

interface CreateTraceFormTraceDefinitionItemsProps {
  form: CreateTraceForm
}

const { form } = defineProps<CreateTraceFormTraceDefinitionItemsProps>()
</script>

<template>
  <div class="create-trace-form-trace-definition-items av-col av-p-md">
    <div
      class="av-col av-gap-lg"
      data-testid="form-fields-container"
    >
      <div class="av-col">
        <TraceFileUploadFormField
          :form="form"
        />
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
